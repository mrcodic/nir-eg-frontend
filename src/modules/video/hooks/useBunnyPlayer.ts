import {
  logView,
  markLessonComplete,
  WATCH_THRESHOLD_SECS,
} from "@/services/video.service";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import {
  PlayerJsEventData,
  PlayerJsInstance,
  UseBunnyPlayerOptions,
  UseBunnyPlayerReturn,
} from "@/types/bunny";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export function useBunnyPlayer({
  videoId,
  roomId,
  classroomId,
  lessonId,
  videoCompleted,
}: UseBunnyPlayerOptions): UseBunnyPlayerReturn {
  const queryClient = useQueryClient();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<PlayerJsInstance | null>(null);
  const completedRef = useRef(false);
  const viewLoggedRef = useRef(false);
  const lastMetricsSampleAtRef = useRef(0);

  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  // ── Reset when the video changes ─────────────────────────────────────────
  useEffect(() => {
    completedRef.current = false;
    viewLoggedRef.current = false;
    playerRef.current = null;
    lastMetricsSampleAtRef.current = 0;
    setIsReady(false);
    setDuration(null);
  }, [videoId]);

  // ── Main player setup ─────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const onReady = () => {
      if (cancelled) return;
      setIsReady(true);
      playerRef.current?.getDuration((dur) => {
        if (!cancelled) setDuration(dur);
      });
    };

    const onTimeUpdate = async (data?: PlayerJsEventData) => {
      if (cancelled || !data) return;

      const { seconds = 0, duration: dur = 0 } = data;

      useVideoPlayerStore.getState().setCurrentTime(Math.floor(seconds));

      // ── 90% completion → mark lesson complete ────────────────────────
      if (
        !videoCompleted &&
        !completedRef.current &&
        dur > 0 &&
        seconds / dur >= 0.9
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

      maybeMarkWatched(seconds, dur);
    };

    const onSeeked = (data?: PlayerJsEventData) => {
      if (cancelled || !data) return;
      useVideoPlayerStore
        .getState()
        .setCurrentTime(Math.floor(data.seconds ?? 0));
    };

    const onEnded = () => {
      if (cancelled || viewLoggedRef.current) return;
      viewLoggedRef.current = true;
      void logView(videoId, roomId, classroomId);
    };

    // Named so they can be passed to player.off() with the same reference
    const onPlay = () => useVideoPlayerStore.getState().setIsPlaying(true);
    const onPause = () => useVideoPlayerStore.getState().setIsPlaying(false);

    /**
     * Decides whether the user has "watched enough" to count as a view.
     *  • Video ≤ 15 min → fire when 10 s remain or fewer
     *  • Video > 15 min → fire once the user reaches the 15-minute mark
     *
     * Falls back to player.getCurrentTime() every 5 s for the long-video case
     * since Bunny's Player.js doesn't expose getTotalPlayed/getTotalCovered.
     */
    const maybeMarkWatched = (currentSeconds: number, dur: number) => {
      if (viewLoggedRef.current) return;
      if (!dur || Number.isNaN(dur)) return;

      if (dur <= WATCH_THRESHOLD_SECS) {
        if (currentSeconds >= Math.max(dur - 10, 0)) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }
        return;
      }

      if (currentSeconds >= WATCH_THRESHOLD_SECS) {
        viewLoggedRef.current = true;
        void logView(videoId, roomId, classroomId);
        return;
      }

      // Throttled fallback every 5 s
      const now = Date.now();
      if (now - lastMetricsSampleAtRef.current > 5_000) {
        lastMetricsSampleAtRef.current = now;
        playerRef.current?.getCurrentTime((ct) => {
          if (viewLoggedRef.current || cancelled) return;
          if (ct >= WATCH_THRESHOLD_SECS) {
            viewLoggedRef.current = true;
            void logView(videoId, roomId, classroomId);
          }
        });
      }
    };

    // ── Bootstrap ─────────────────────────────────────────────────────────
    (async () => {
      if (!iframeRef.current) return;

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
      player.on("play", onPlay);
      player.on("pause", onPause);

      useVideoPlayerStore.getState().registerPause(() => player.pause());
    })();

    return () => {
      cancelled = true;

      const p = playerRef.current;
      if (p && iframeRef.current?.contentWindow) {
        p.off("ready", onReady);
        p.off("timeupdate", onTimeUpdate);
        p.off("seeked", onSeeked);
        p.off("ended", onEnded);
        p.off("play", onPlay);
        p.off("pause", onPause);
      }

      playerRef.current = null;
      useVideoPlayerStore.getState().unregisterPause();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, roomId, classroomId, lessonId, videoCompleted]);

  return { iframeRef, playerRef, isReady, duration } as const;
}
