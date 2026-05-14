import { mutateClient } from "@/helpers/post-client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Subset of the Player.js API surface used by this hook */
type PlayerJsInstance = {
  on: (event: string, cb: (data?: PlayerJsEventData) => void) => void;
  off: (event: string, cb: (data?: PlayerJsEventData) => void) => void;
  getDuration: (cb: (duration: number) => void) => void;
  getCurrentTime: (cb: (seconds: number) => void) => void;
  play: () => void;
  pause: () => void;
};

/** Data shape emitted by Bunny's `timeupdate` event */
type PlayerJsEventData = {
  seconds?: number;
  duration?: number;
  percent?: number;
};

/** Player.js constructor available on `window.playerjs` after the script loads */
type PlayerJsConstructor = new (iframe: HTMLIFrameElement) => PlayerJsInstance;

declare global {
  interface Window {
    playerjs?: { Player: PlayerJsConstructor };
  }
}

// ---------------------------------------------------------------------------
// View-log helper (fire-and-forget)
// ---------------------------------------------------------------------------

async function logView(
  videoId: string,
  roomId: string | number,
  classroomId: string | number,
): Promise<void> {
  try {
    await mutateClient("/video/confirm-view", {
      body: { video_id: videoId, room_id: roomId, classroom_id: classroomId },
    });
  } catch {
    // swallow – never surface view-log failures to the user
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseBunnyPlayerOptions {
  videoId: string;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  /** Callback to sync current playback position to parent state */
  setCurrentTime: (seconds: number) => void;
  /** Whether the lesson is already marked completed (prevents duplicate API calls) */
  videoCompleted: boolean;
}

export interface UseBunnyPlayerReturn {
  /** Attach this ref to the <iframe> element */
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  /** Direct access to the Player.js instance (for imperative control) */
  playerRef: React.MutableRefObject<PlayerJsInstance | null>;
  /** True once the `ready` event fires */
  isReady: boolean;
  /** Video duration in seconds once the player has loaded metadata */
  duration: number | null;
}

export function useBunnyPlayer({
  videoId,
  roomId,
  classroomId,
  lessonId,
  setCurrentTime,
  videoCompleted,
}: UseBunnyPlayerOptions): UseBunnyPlayerReturn {
  const queryClient = useQueryClient();

  // Refs that must survive re-renders without triggering them
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<PlayerJsInstance | null>(null);
  const completedRef = useRef(false);
  const viewLoggedRef = useRef(false);
  const lastMetricsSampleAtRef = useRef(0);

  // Reactive state
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  // ── Reset when the video changes ────────────────────────────────────────
  useEffect(() => {
    completedRef.current = false;
    viewLoggedRef.current = false;
    playerRef.current = null;
    lastMetricsSampleAtRef.current = 0;
    setIsReady(false);
    setDuration(null);
  }, [videoId]);

  // ── Main player setup ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // Named handlers so we can call player.off() during cleanup
    const onReady = () => {
      if (cancelled) return;
      setIsReady(true);

      // getDuration uses a callback – Bunny player follows Player.js spec
      playerRef.current?.getDuration((dur) => {
        if (!cancelled) setDuration(dur);
      });
    };

    const onTimeUpdate = async (data?: PlayerJsEventData) => {
      if (cancelled || !data) return;

      const { seconds = 0, duration: dur = 0 } = data;

      setCurrentTime(Math.floor(seconds));

      // ── 90 % completion → mark lesson complete ───────────────────────
      if (
        !videoCompleted &&
        !completedRef.current &&
        dur > 0 &&
        seconds / dur >= 0.9
      ) {
        completedRef.current = true;

        try {
          await mutateClient("/students/lesson/store_completed", {
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
        } catch {
          // swallow – preserve UX
        }
      }

      // ── Watched-threshold check ──────────────────────────────────────
      maybeMarkWatched(seconds, dur);
    };

    const onSeeked = (data?: PlayerJsEventData) => {
      if (cancelled || !data) return;
      setCurrentTime(Math.floor(data.seconds ?? 0));
    };

    const onEnded = () => {
      if (cancelled || viewLoggedRef.current) return;
      viewLoggedRef.current = true;
      void logView(videoId, roomId, classroomId);
    };

    /**
     * Decides whether the user has "watched enough" to count as a view.
     *
     * Rules (mirror the VdoCipher hook):
     *  • Video ≤ 15 min  → fire when 10 s remain or fewer
     *  • Video > 15 min  → fire once the user has reached the 15-minute mark
     *
     * Bunny Player.js doesn't expose getTotalPlayed / getTotalCovered, so we
     * use `currentTime` directly (same data the timeupdate event gives us).
     * We throttle sampling to every 5 s to avoid hammering the API.
     */
    const maybeMarkWatched = (currentSeconds: number, dur: number) => {
      if (viewLoggedRef.current) return;
      if (!dur || Number.isNaN(dur)) return;

      const SHORT_THRESHOLD_SECS = 900; // 15 minutes

      if (dur <= SHORT_THRESHOLD_SECS) {
        // Short video: watched when within 10 s of the end
        if (currentSeconds >= Math.max(dur - 10, 0)) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }
        return;
      }

      // Long video: watched once we reach 15-minute mark
      if (currentSeconds >= SHORT_THRESHOLD_SECS) {
        viewLoggedRef.current = true;
        void logView(videoId, roomId, classroomId);
        return;
      }

      // Throttled fallback sample (every 5 s) using getCurrentTime
      const now = Date.now();
      if (now - lastMetricsSampleAtRef.current > 5_000) {
        lastMetricsSampleAtRef.current = now;

        playerRef.current?.getCurrentTime((ct) => {
          if (viewLoggedRef.current || cancelled) return;
          if (ct >= SHORT_THRESHOLD_SECS) {
            viewLoggedRef.current = true;
            void logView(videoId, roomId, classroomId);
          }
        });
      }
    };

    // ── Bootstrap ────────────────────────────────────────────────────────
    (async () => {
      if (!iframeRef.current) return;

      // Wait for the globally loaded script to be ready
      let attempts = 0;
      while (!window.playerjs?.Player && attempts < 50) {
        await new Promise((r) => setTimeout(r, 200));
        attempts++;
      }

      if (!window.playerjs?.Player || cancelled) return;

      const player = new window.playerjs.Player(iframeRef.current);
      playerRef.current = player;

      player.on("ready", onReady);
      player.on("timeupdate", onTimeUpdate);
      player.on("seeked", onSeeked);
      player.on("ended", onEnded);
    })();

    return () => {
      cancelled = true;

      // Player.js `off` is a best-effort teardown; the iframe is unmounted
      // anyway so leaks are not a concern, but being explicit is good practice.
      const p = playerRef.current;
      if (p) {
        p.off("ready", onReady);
        p.off("timeupdate", onTimeUpdate);
        p.off("seeked", onSeeked);
        p.off("ended", onEnded);
      }
    };

    // videoId is the primary ID — everything else is stable per session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, roomId, classroomId, lessonId, videoCompleted]);

  return {
    iframeRef,
    playerRef,
    isReady,
    duration,
  } as const;
}
