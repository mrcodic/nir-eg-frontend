import {
  logView,
  markLessonComplete,
  waitForVdoAPI,
  WATCH_THRESHOLD_SECS,
} from "@/services/video.service";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

// ── VdoCipher types ───────────────────────────────────────────────────────────

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

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useVideoCipherPlayer({
  response,
  videoId,
  roomId,
  classroomId,
  lessonId,
  videoCompleted,
}: {
  response: { otp?: string; playbackInfo?: string } | null;
  videoId: string;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  videoCompleted: boolean;
}) {
  const queryClient = useQueryClient();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<VdoInstance | null>(null);
  const completedRef = useRef(false);
  const viewLoggedRef = useRef(false);
  const lastMetricsSampleAtRef = useRef(0);

  const [duration, setDuration] = useState<number | null>(null);

  // ── Reset when the video changes ─────────────────────────────────────────
  useEffect(() => {
    viewLoggedRef.current = false;
    completedRef.current = false;
    playerRef.current = null;
    lastMetricsSampleAtRef.current = 0;
    setDuration(null);
  }, [videoId]);

  // ── Main player setup ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      if (!response?.otp) return;
      if (!iframeRef.current) return;

      const ok = await waitForVdoAPI();
      if (!ok || cancelled) return;

      // Retry while the iframe boots
      let inst: VdoInstance | null =
        window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      for (let i = 0; !inst && i < 40 && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, 200));
        inst = window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      }
      if (!inst || cancelled) return;

      playerRef.current = inst;
      const v = inst.video;

      // Register pause with the global store so any component can pause
      useVideoPlayerStore.getState().registerPause(() => v.pause());
      cleanups.push(() => useVideoPlayerStore.getState().unregisterPause());

      // ── Event handlers ──────────────────────────────────────────────

      const onLoadedMeta = () => setDuration(v.duration || 0);

      const onTimeUpdate = async () => {
        const ct = v?.currentTime ?? 0;
        const dur = v?.duration ?? 0;

        useVideoPlayerStore.getState().setCurrentTime(Math.floor(ct));

        // 90% completion → mark lesson complete
        if (
          !videoCompleted &&
          !completedRef.current &&
          dur > 0 &&
          ct / dur >= 0.9
        ) {
          completedRef.current = true;
          try {
            await markLessonComplete({
              queryClient,
              roomId,
              lessonId,
              classroomId,
            });
          } catch {
            // swallow – preserve UX
          }
        }

        void maybeMarkWatched(inst!, v);
      };

      const onSeeking = () => {
        useVideoPlayerStore
          .getState()
          .setCurrentTime(v?.currentTime ? Math.floor(v.currentTime) : 0);
      };

      const onEnded = () => {
        if (!viewLoggedRef.current) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }
      };

      const onPlay = () => useVideoPlayerStore.getState().setIsPlaying(true);
      const onPause = () => useVideoPlayerStore.getState().setIsPlaying(false);

      v.addEventListener("loadedmetadata", onLoadedMeta);
      v.addEventListener("timeupdate", onTimeUpdate);
      v.addEventListener("seeking", onSeeking);
      v.addEventListener("ended", onEnded);
      v.addEventListener("play", onPlay);
      v.addEventListener("pause", onPause);

      cleanups.push(() =>
        v.removeEventListener("loadedmetadata", onLoadedMeta),
      );
      cleanups.push(() => v.removeEventListener("timeupdate", onTimeUpdate));
      cleanups.push(() => v.removeEventListener("seeking", onSeeking));
      cleanups.push(() => v.removeEventListener("ended", onEnded));
      cleanups.push(() => v.removeEventListener("play", onPlay));
      cleanups.push(() => v.removeEventListener("pause", onPause));

      // VdoCipher-specific: also listen to the API-level statusChange event
      // as a safety net for the "ended" case
      const statusHandler = (evt: VdoStatusChange) => {
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
      if (typeof maybeUnsub === "function") {
        cleanups.push(maybeUnsub);
      } else if (inst.api.removeEventListener) {
        cleanups.push(() =>
          inst!.api.removeEventListener?.("statusChange", statusHandler),
        );
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.otp, videoId, roomId, classroomId, lessonId, videoCompleted]);

  // ── Watch-threshold logic ─────────────────────────────────────────────────
  // VdoCipher exposes getTotalPlayed / getTotalCovered for more accurate
  // tracking than raw currentTime, so it gets its own implementation.

  const maybeMarkWatched = async (inst: VdoInstance, v: HTMLVideoElement) => {
    if (viewLoggedRef.current) return;

    const dur = v.duration || duration || 0;
    const ct = v.currentTime || 0;

    if (!dur || Number.isNaN(dur)) return;

    if (dur <= WATCH_THRESHOLD_SECS) {
      if (ct >= Math.max(dur - 10, 0)) {
        viewLoggedRef.current = true;
        await logView(videoId, roomId, classroomId);
      }
      return;
    }

    // Long video: currentTime check first (fast path)
    if (ct >= WATCH_THRESHOLD_SECS) {
      viewLoggedRef.current = true;
      await logView(videoId, roomId, classroomId);
      return;
    }

    // Throttled precise check via VdoCipher API every 5 s
    const now = Date.now();
    if (now - lastMetricsSampleAtRef.current > 5_000) {
      lastMetricsSampleAtRef.current = now;
      try {
        const [played, covered] = await Promise.all([
          inst.api.getTotalPlayed(),
          inst.api.getTotalCovered(),
        ]);
        if (played >= WATCH_THRESHOLD_SECS || covered >= WATCH_THRESHOLD_SECS) {
          viewLoggedRef.current = true;
          await logView(videoId, roomId, classroomId);
        }
      } catch {
        // swallow
      }
    }
  };

  return { iframeRef, playerRef, duration } as const;
}
