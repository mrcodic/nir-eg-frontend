import { extractTenantFromHost } from "@/helpers/fetch-utils";
import { mutateClient } from "@/helpers/post-client";
import {
  reportWatchTime,
  sendPendingReports,
  WatchTimeTracker,
} from "@/services/videoTracker";
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
    console.log("🎬 logView");
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

  // EXISTING STATE & REFS (UNCHANGED)
  const completedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<VdoInstance | null>(null);
  const [hideBtn, setHideBtn] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const viewLoggedRef = useRef(true);
  const lastMetricsSampleAtRef = useRef(0);

  // NEW: Watch time tracking
  const { subdomain: tenantSubdomain } = extractTenantFromHost();
  const watchTimeTrackerRef = useRef<WatchTimeTracker | null>(null);
  const [uniqueSecondsWatched, setUniqueSecondsWatched] = useState(0);
  const [uniqueMinutesWatched, setUniqueMinutesWatched] = useState(0);

  // EXISTING RESET LOGIC (EXTENDED)
  useEffect(() => {
    // Existing resets (UNCHANGED)
    // viewLoggedRef.current = false;
    // completedRef.current = false;
    // playerRef.current = null;
    // setDuration(null);
    // setHideBtn(false);

    // NEW: Initialize watch time tracker
    watchTimeTrackerRef.current = new WatchTimeTracker(
      videoId,
      tenantSubdomain,
      5,
    );
    // setUniqueSecondsWatched(0);
    // setUniqueMinutesWatched(0);
    void sendPendingReports();
  }, [videoId, tenantSubdomain]);

  // NEW: Send final report on unmount
  useEffect(() => {
    return () => {
      if (watchTimeTrackerRef.current) {
        // ✅ Only send if there's new unreported data
        if (watchTimeTrackerRef.current.hasUnreportedData()) {
          const payload = watchTimeTrackerRef.current.getReportPayload();
          void reportWatchTime(payload);
        }
      }
    };
  }, []);

  // EXISTING PLAYER SETUP (EXTENDED)
  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      if (!response?.otp) return;
      if (!iframeRef.current) return;

      const ok = await waitForVdoAPI();
      if (!ok || cancelled) return;

      // EXISTING: try to obtain instance (retry while iframe boots)
      let inst: VdoInstance | null =
        window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      for (let i = 0; !inst && i < 40 && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, 200));
        inst = window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      }
      if (!inst || cancelled) return;

      playerRef.current = inst;

      const v = inst.video;

      // EXISTING: onLoadedMeta (UNCHANGED)
      const onLoadedMeta = () => {
        const dur = v.duration || 0;
        setDuration(dur);

        // ✅ Set video duration in tracker
        if (watchTimeTrackerRef.current && dur > 0) {
          watchTimeTrackerRef.current.setVideoDuration(dur);
        }
      };

      // EXISTING + EXTENDED: onTimeUpdate
      const onTimeUpdate = async () => {
        const ct = v?.currentTime ?? 0;
        const dur = v?.duration ?? 0;

        // EXISTING: setCurrentTime (UNCHANGED)
        setCurrentTime(Math.floor(ct));

        // NEW: Track watch time
        if (watchTimeTrackerRef.current && ct > 0) {
          const tracker = watchTimeTrackerRef.current;
          tracker.trackSegment(ct);

          const uniqueSeconds = tracker.getUniqueSecondsWatched();
          const uniqueMinutes = tracker.getUniqueMinutesWatched();

          setUniqueSecondsWatched(uniqueSeconds);
          setUniqueMinutesWatched(uniqueMinutes);

          if (tracker.shouldReport()) {
            const payload = tracker.getReportPayload();
            await reportWatchTime(payload);
          }
        }

        // EXISTING: Mark lesson completed at 90% (UNCHANGED)
        if (
          !videoCompleted &&
          !completedRef.current &&
          dur > 0 &&
          ct / dur >= 0.9
        ) {
          completedRef.current = true;
          console.log("🎬 finished video 90% ");

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

        // EXISTING: maybeMarkWatched (UNCHANGED)
        maybeMarkWatched(inst, v);
      };

      // EXISTING: onSeeking (UNCHANGED)
      const onSeeking = () => {
        setCurrentTime(v?.currentTime ? Math.floor(v.currentTime) : 0);
      };

      // EXISTING + EXTENDED: onEnded
      const onEnded = async () => {
        // EXISTING: logView (UNCHANGED)
        if (!viewLoggedRef.current) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }

        // ✅ UPDATED: Only send if there's new data
        if (watchTimeTrackerRef.current?.hasUnreportedData()) {
          const payload = watchTimeTrackerRef.current.getReportPayload();
          await reportWatchTime(payload);
        }
      };

      // EXISTING: Event listeners (UNCHANGED)
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

      // EXISTING: statusHandler (UNCHANGED)
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

  // EXISTING: maybeMarkWatched (UNCHANGED)
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
    // NEW: Watch time tracking data
    uniqueSecondsWatched,
    uniqueMinutesWatched,
    tenantSubdomain,
  } as const;
}
