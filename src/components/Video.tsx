"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import TamperResistantOverlay from "@/utils/TamperResistantOverlay";
import { useQueryClient } from "@tanstack/react-query";
import { FileWarning } from "lucide-react";
import LoadingSpinner from "./Loading";

type VdoStatusChange =
  | string
  | { code?: number; label?: string; status?: string };

type VdoInstance = {
  video: HTMLVideoElement; // Proxy HTML5 video (currentTime, duration, events, ...)
  api: {
    addEventListener: (
      evt: string,
      cb: (e: VdoStatusChange) => void
    ) => () => void | void; // returns optional remove fn
    removeEventListener?: (evt: string, cb: (e: any) => void) => void;

    // Custom analytics calls:
    getTotalPlayed: () => Promise<number>; // seconds watched (actual)
    getTotalCovered: () => Promise<number>; // unique timeline coverage (seconds)
  };
};

async function waitForVdoAPI(timeoutMs = 12000): Promise<boolean> {
  return new Promise((resolve) => {
    // already present
    if (typeof window !== "undefined" && window.VdoPlayer) {
      return resolve(true);
    }

    let done = false;
    window.onVdoPlayerV2APIReady = () => {
      if (done) return;
      done = true;
      resolve(true);
    };

    const poll = setInterval(() => {
      if (window.VdoPlayer && !done) {
        clearInterval(poll);
        done = true;
        resolve(true);
      }
    }, 200);

    setTimeout(() => {
      if (done) return;
      clearInterval(poll);
      resolve(false);
    }, timeoutMs);
  });
}

interface VideoProps {
  response: { otp?: string; playbackInfo?: string } | null;
  videoId: string;
  locked: boolean;
  setCurrentTime(time: number): void;
  exceededViews: boolean;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  videoCompleted: boolean;
  otpError: boolean;
}

export default function Video({
  response,
  videoId,
  locked,
  setCurrentTime,
  exceededViews,
  roomId,
  classroomId,
  lessonId,
  videoCompleted,
  otpError,
}: VideoProps) {
  const queryClient = useQueryClient();

  const completedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<VdoInstance | null>(null);

  const [hideBtn, setHideBtn] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const viewLoggedRef = useRef(false);
  const lastMetricsSampleAtRef = useRef(0);

  // Reset when switching videos
  useEffect(() => {
    viewLoggedRef.current = false;
    completedRef.current = false;
    playerRef.current = null;
    setDuration(null);
    setHideBtn(false);
  }, [videoId]);

  // Init & listeners
  useEffect(() => {
    let cancelled = false;

    // cleanup fns for DOM & API listeners
    const cleanups: Array<() => void> = [];

    (async () => {
      if (!response?.otp) return; // wait for OTP
      if (!iframeRef.current) return;

      const ok = await waitForVdoAPI();
      if (!ok || cancelled) return;

      // player instance (retry a bit while iframe boots)
      let inst = window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      for (let i = 0; !inst && i < 40 && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, 200));
        inst = window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      }
      if (!inst || cancelled) return;

      playerRef.current = inst;

      // --- HTML5 proxy video events (preferred) ---
      const v = inst.video;

      const onLoadedMeta = () => setDuration(v.duration || 0);
      const onTimeUpdate = async () => {
        const ct = v?.currentTime ?? 0;
        const dur = v?.duration ?? 0;

        setCurrentTime(Math.floor(ct));

        // ✅ mark watched/completed based on playback position
        if (
          !videoCompleted &&
          !completedRef.current &&
          dur > 0 &&
          ct / dur >= 0.9
        ) {
          completedRef.current = true;

          console.log("🎬 Video 90%+ watched, marking completed");
          try {
            const res = await axios.post(
              `/api?url=students/lesson/store_completed`,
              {
                room_id: roomId,
                lesson_id: lessonId,
                classroom_id: classroomId,
              }
            );

            console.log("✅ Marked video as completed", res.data);

            queryClient.invalidateQueries({
              queryKey: [`/students/get-lessons/${roomId}`],
            });
          } catch (err) {
            console.log("❌ Failed to mark video completed", err);
          }
        }

        // Thresholds:
        // - Long video: count as watched once either position >= 900s OR actual-watched metrics reach 900s
        // - Short video: near the end by position (dur - 10s)
        maybeMarkWatched(inst, v);
      };
      const onSeeking = () => {
        // expose the latest time during seeks as well
        setCurrentTime(v?.currentTime ? Math.floor(v.currentTime) : 0);
      };
      const onEnded = () => {
        if (!viewLoggedRef.current) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }
      };

      inst.video.addEventListener("ended", onEnded);

      // track video progress if more than 90%

      v.addEventListener("loadedmetadata", onLoadedMeta);
      v.addEventListener("timeupdate", onTimeUpdate);
      v.addEventListener("seeking", onSeeking);
      v.addEventListener("ended", onEnded);

      cleanups.push(() =>
        v.removeEventListener("loadedmetadata", onLoadedMeta)
      );
      cleanups.push(() => v.removeEventListener("timeupdate", onTimeUpdate));
      cleanups.push(() => v.removeEventListener("seeking", onSeeking));
      cleanups.push(() => v.removeEventListener("ended", onEnded));

      // --- Optional: VdoCipher statusChange hook ---
      const statusHandler = (evt: any) => {
        const label =
          typeof evt === "string" ? evt : evt?.label || evt?.status || "";
        if (
          String(label).toLowerCase().includes("end") &&
          !viewLoggedRef.current
        ) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }
      };
      const maybeUnsub = inst.api.addEventListener(
        "statusChange",
        statusHandler
      );
      if (typeof maybeUnsub === "function") cleanups.push(maybeUnsub);
      else if (inst.api.removeEventListener) {
        cleanups.push(() =>
          inst.api.removeEventListener?.("statusChange", statusHandler)
        );
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [response?.otp, videoId, roomId, classroomId]);

  const maybeMarkWatched = async (inst: VdoInstance, v: HTMLVideoElement) => {
    if (viewLoggedRef.current) return;

    const dur = v.duration || duration || 0;
    const ct = v.currentTime || 0;

    if (!dur || Number.isNaN(dur)) return;

    // Short videos: within last 10s by position
    if (dur <= 900 && ct >= Math.max(dur - 10, 0)) {
      viewLoggedRef.current = true;
      await logView(videoId, roomId, classroomId);
      return;
    }

    // Long videos: allow either position >= 900s OR real/unique watch >= 900s
    if (dur > 900) {
      if (ct >= 900) {
        viewLoggedRef.current = true;
        await logView(videoId, roomId, classroomId);
        return;
      }

      // Throttle metric sampling to ~5s
      const now = Date.now();
      if (now - lastMetricsSampleAtRef.current > 5000) {
        lastMetricsSampleAtRef.current = now;
        try {
          const [played, covered] = await Promise.all([
            inst.api.getTotalPlayed(),
            inst.api.getTotalCovered(),
          ]);
          if (played >= 900 || covered >= 900) {
            viewLoggedRef.current = true;
            await logView(videoId, roomId, classroomId);
            return;
          }
        } catch {
          // ignore metric failures; position rule will still work
        }
      }
    }
  };

  async function logView(
    videoId: string,
    roomId: string | number,
    classroomId: string | number
  ) {
    try {
      await axios.post(
        "/api?url=video/confirm-view",
        { video_id: videoId, room_id: roomId, classroom_id: classroomId },
        { withCredentials: true }
      );
    } catch {
      // swallow; you can toast/log if needed
    }
  }

  if (locked) {
    return (
      <div className="flex-1 space-y-8">
        <div
          className="gap-4 rounded-lg bg-background p-2 flex items-center"
          style={{ boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)" }}
        >
          <img src="/assets/WarningColor.svg" />
          <div className="text-[16px] flex flex-col gap-2 text-[#121212]">
            <div className="flex text-[12px] gap-2">
              <span className="text-[#121212] text-lg whitespace-nowrap font-medium">
                {exceededViews
                  ? "لقد تجاوزت الحد الأقصى لعدد المشاهدات المسموح بها لهذا الدرس"
                  : "يجب ان تقوم باجتياز الاختبار أولا"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 h-[520px] bg-gray-100 w-full">
          <Image
            src="/assets/Locked.png"
            width={150}
            height={150}
            alt="Locked"
          />
        </div>
      </div>
    );
  }

  return response?.otp ? (
    <div className="flex-1 h-fit relative overflow-hidden">
      <TamperResistantOverlay>
        <iframe
          ref={iframeRef}
          id="vdocipher-iframe"
          className="w-full relative h-[520px]"
          src={`https://player.vdocipher.com/v2/?otp=${response.otp}&playbackInfo=${response.playbackInfo}`}
          style={{ border: 0 }}
          allow="encrypted-media"
          allowFullScreen
          title="VdoCipher Video"
        />
      </TamperResistantOverlay>

      {!hideBtn && (
        <button
          onClick={() => {
            const inputEl = document.getElementById("community-input");
            if (inputEl) {
              inputEl.scrollIntoView({ behavior: "smooth" });
              (inputEl as HTMLElement).focus?.();
            }
            const inst = playerRef.current;
            inst?.video?.pause?.();
          }}
          className="absolute z-50 text-primary-700 border border-gray-light transition-all p-2 w-[250px] py-4 rounded-lg right-8 bg-background bottom-14"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setHideBtn(true);
            }}
            className="bg-[#F8DEC5] absolute top-2 left-2 rounded-full flex items-center justify-center w-[16px] h-[16px]"
          >
            <Image src="/assets/Close.svg" width={12} height={12} alt="Close" />
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/assets/icon-1.svg"
              width={32}
              height={32}
              alt="icon-1"
            />
            <span className="text-[16px] font-bold"> عندك استفسار؟</span>
          </div>
        </button>
      )}
    </div>
  ) : otpError ? (
    <div className="min-h-[520px] bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <FileWarning className="stroke-red-500" />
        <p className="text-lg font-bold">حدث خطأ ما</p>
      </div>
    </div>
  ) : (
    <LoadingSpinner className="min-h-[520px]" />
  );
}
