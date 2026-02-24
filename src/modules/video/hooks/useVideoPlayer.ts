import { mutateClient } from "@/helpers/post-client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

type VdoStatusChange =
  | string
  | { code?: number; label?: string; status?: string };

type VdoInstance = {
  video: HTMLVideoElement;
  api: {
    addEventListener: (
      evt: string,
      cb: (e: VdoStatusChange) => void,
    ) => () => void | void;
    removeEventListener?: (evt: string, cb: (e: any) => void) => void;

    getTotalPlayed: () => Promise<number>;
    getTotalCovered: () => Promise<number>;
  };
};

async function waitForVdoAPI(timeoutMs = 12_000): Promise<boolean> {
  return new Promise((resolve) => {
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

async function logView(
  videoId: string,
  roomId: string | number,
  classroomId: string | number,
) {
  try {
    await mutateClient("/video/confirm-view", {
      body: { video_id: videoId, room_id: roomId, classroom_id: classroomId },
    });
  } catch {}
}

export function useVideoPlayer({
  response,
  videoId,
  roomId,
  classroomId,
  lessonId,
  setCurrentTime,
  videoCompleted,
}: {
  response: { otp?: string; playbackInfo?: string } | null;
  videoId: string;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  setCurrentTime: (t: number) => void;
  videoCompleted: boolean;
}) {
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

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      if (!response?.otp) return;
      if (!iframeRef.current) return;

      const ok = await waitForVdoAPI();
      if (!ok || cancelled) return;

      // try to obtain instance (retry while iframe boots)
      let inst: VdoInstance | null =
        window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      for (let i = 0; !inst && i < 40 && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, 200));
        inst = window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      }
      if (!inst || cancelled) return;

      playerRef.current = inst;

      const v = inst.video;

      const onLoadedMeta = () => setDuration(v.duration || 0);

      const onTimeUpdate = async () => {
        const ct = v?.currentTime ?? 0;
        const dur = v?.duration ?? 0;

        setCurrentTime(Math.floor(ct));

        if (
          !videoCompleted &&
          !completedRef.current &&
          dur > 0 &&
          ct / dur >= 0.9
        ) {
          completedRef.current = true;
          try {
            await mutateClient(`/students/lesson/store_completed`, {
              body: {
                room_id: roomId,
                lesson_id: lessonId,
                classroom_id: classroomId,
              },
            });

            queryClient.invalidateQueries({
              queryKey: [
                `/students/get-lessons/${roomId}?classroom_id=${classroomId}`,
              ],
            });
          } catch (err) {
            // swallow – preserve UX
          }
        }

        maybeMarkWatched(inst, v);
      };

      const onSeeking = () => {
        setCurrentTime(v?.currentTime ? Math.floor(v.currentTime) : 0);
      };

      const onEnded = () => {
        if (!viewLoggedRef.current) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }
      };

      inst.video.addEventListener("ended", onEnded);

      v.addEventListener("loadedmetadata", onLoadedMeta);
      v.addEventListener("timeupdate", onTimeUpdate);
      v.addEventListener("seeking", onSeeking);
      v.addEventListener("ended", onEnded);

      cleanups.push(() =>
        v.removeEventListener("loadedmetadata", onLoadedMeta),
      );
      cleanups.push(() => v.removeEventListener("timeupdate", onTimeUpdate));
      cleanups.push(() => v.removeEventListener("seeking", onSeeking));
      cleanups.push(() => v.removeEventListener("ended", onEnded));

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
        statusHandler,
      );
      if (typeof maybeUnsub === "function") cleanups.push(maybeUnsub);
      else if (inst.api.removeEventListener) {
        cleanups.push(() =>
          inst.api.removeEventListener?.("statusChange", statusHandler),
        );
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.otp, videoId, roomId, classroomId, lessonId, videoCompleted]);

  const maybeMarkWatched = async (inst: VdoInstance, v: HTMLVideoElement) => {
    if (viewLoggedRef.current) return;

    const dur = v.duration || duration || 0;
    const ct = v.currentTime || 0;

    if (!dur || Number.isNaN(dur)) return;

    if (dur <= 900 && ct >= Math.max(dur - 10, 0)) {
      viewLoggedRef.current = true;
      await logView(videoId, roomId, classroomId);
      return;
    }

    if (dur > 900) {
      if (ct >= 900) {
        viewLoggedRef.current = true;
        await logView(videoId, roomId, classroomId);
        return;
      }

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
        } catch {}
      }
    }
  };

  return {
    iframeRef,
    playerRef,
    hideBtn,
    setHideBtn,
    duration,
  } as const;
}
