// hooks/useVideoPlayer.ts

import { extractTenantFromHost } from "@/helpers/fetch-utils";
import { mutateClient } from "@/helpers/post-client";
import {
  reportWatchTime,
  sendPendingReports,
  WatchTimeTracker,
  type QualityInfo,
} from "@/services/videoTracker";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

// ✅ ENHANCED: VdoCipher API types
type VdoQuality = {
  id: number;
  bitrate?: number;
  bandwidth?: number; // ✅ ADDED: VdoCipher returns this in bps
  label?: string;
  height?: number;
  width?: number;
  active?: boolean;
  type?: string;
  language?: string;
};

type VdoInstance = {
  video: HTMLVideoElement;
  api: {
    addEventListener: (evt: string, cb: (e: any) => void) => () => void | void;
    removeEventListener?: (evt: string, cb: (e: any) => void) => void;

    getTotalPlayed: () => Promise<number>;
    getTotalCovered: () => Promise<number>;

    getVideoQualities: () => Promise<{
      adaptive: boolean;
      qualities: VdoQuality[];
    }>;
    setVideoQuality: (id: number) => Promise<void>;
    enableAdaptiveVideo: () => Promise<void>;

    getMetaData: () => Promise<{
      title?: string;
      description?: string;
      duration?: number;
      length?: number;
      tech?: any[];
      version?: string;
    }>;
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

  // EXISTING STATE & REFS
  const completedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<VdoInstance | null>(null);
  const [hideBtn, setHideBtn] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const viewLoggedRef = useRef(false);
  const lastMetricsSampleAtRef = useRef(0);

  // Watch time tracking
  const { subdomain: tenantSubdomain } = extractTenantFromHost();
  const watchTimeTrackerRef = useRef<WatchTimeTracker | null>(null);
  const [uniqueSecondsWatched, setUniqueSecondsWatched] = useState(0);
  const [uniqueMinutesWatched, setUniqueMinutesWatched] = useState(0);

  // ✅ NEW: Bitrate & quality tracking
  const [currentBitrate, setCurrentBitrate] = useState(2500);
  const [currentQuality, setCurrentQuality] = useState<QualityInfo | null>(
    null,
  );
  const [availableQualities, setAvailableQualities] = useState<VdoQuality[]>(
    [],
  );
  const [isAdaptive, setIsAdaptive] = useState(true);
  const [estimatedBandwidthMB, setEstimatedBandwidthMB] = useState(0);

  // Initialize tracker
  useEffect(() => {
    watchTimeTrackerRef.current = new WatchTimeTracker(
      videoId,
      tenantSubdomain,
      5,
    );
    void sendPendingReports();
  }, [videoId, tenantSubdomain]);

  // Send final report on unmount
  useEffect(() => {
    return () => {
      if (watchTimeTrackerRef.current?.hasUnreportedData()) {
        const payload = watchTimeTrackerRef.current.getReportPayload();
        void reportWatchTime(payload);
      }
    };
  }, []);

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

  // Player setup
  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      if (!response?.otp) return;
      if (!iframeRef.current) return;

      const ok = await waitForVdoAPI();
      if (!ok || cancelled) return;

      let inst: VdoInstance | null =
        window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      for (let i = 0; !inst && i < 40 && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, 200));
        inst = window.VdoPlayer?.getInstance(iframeRef.current) ?? null;
      }
      if (!inst || cancelled) return;

      playerRef.current = inst;
      const v = inst.video;

      // ✅ ENHANCED: onLoadedMeta with quality detection
      const onLoadedMeta = async () => {
        const dur = v.duration || 0;
        setDuration(dur);

        if (watchTimeTrackerRef.current && dur > 0) {
          watchTimeTrackerRef.current.setVideoDuration(dur);
        }

        try {
          const qualitiesData = await inst.api.getVideoQualities();
          console.log("🔍 Raw qualities data:", qualitiesData);

          setAvailableQualities(qualitiesData.qualities);
          setIsAdaptive(qualitiesData.adaptive);

          const activeQuality = qualitiesData.qualities.find((q) => q.active);

          if (activeQuality) {
            console.log("🔍 Active quality:", activeQuality);

            // ✅ FIXED: Check bandwidth field (in bps) first
            let bitrate = activeQuality.bitrate;

            // ✅ NEW: Try bandwidth field (convert from bps to kbps)
            if (
              (!bitrate || isNaN(bitrate) || bitrate <= 0) &&
              activeQuality.bandwidth
            ) {
              bitrate = Math.round(activeQuality.bandwidth / 1000);
              console.log(
                `🔍 Converted bandwidth ${activeQuality.bandwidth} bps -> ${bitrate} kbps`,
              );
            }

            // Try parsing from label
            if (!bitrate || isNaN(bitrate) || bitrate <= 0) {
              const match = activeQuality.label?.match(
                /(\d+(?:\.\d+)?)\s*kbps/i,
              );
              if (match) {
                bitrate = parseFloat(match[1]);
                console.log(`🔍 Parsed bitrate from label: ${bitrate} kbps`);
              } else {
                bitrate = 2500;
                console.warn(
                  `⚠️ Could not parse bitrate, using default: ${bitrate} kbps`,
                );
              }
            }

            const qualityInfo: QualityInfo = {
              bitrate: bitrate,
              label: activeQuality.label || `${bitrate} kbps`,
              height: activeQuality.height,
              width: activeQuality.width,
            };

            setCurrentBitrate(bitrate);
            setCurrentQuality(qualityInfo);

            watchTimeTrackerRef.current?.setBitrate(bitrate, qualityInfo);
            watchTimeTrackerRef.current?.setAdaptive(qualitiesData.adaptive);

            console.log(
              `📹 Video loaded: ${qualityInfo.label} @ ${bitrate} kbps`,
            );
          }

          const metadata = await inst.api.getMetaData();
          console.log(`📝 Video metadata:`, metadata);
        } catch (error) {
          console.error("❌ Error fetching qualities:", error);
          watchTimeTrackerRef.current?.setBitrate(2500, {
            bitrate: 2500,
            label: "auto",
          });
        }
      };

      // ✅ ENHANCED: onTimeUpdate with bandwidth tracking
      const onTimeUpdate = async () => {
        const ct = v?.currentTime ?? 0;
        const dur = v?.duration ?? 0;

        setCurrentTime(Math.floor(ct));

        // Track watch time & bandwidth
        if (watchTimeTrackerRef.current && ct > 0) {
          const tracker = watchTimeTrackerRef.current;
          tracker.trackSegment(ct);

          const uniqueSeconds = tracker.getUniqueSecondsWatched();
          const uniqueMinutes = tracker.getUniqueMinutesWatched();
          const bandwidthMB = tracker.getEstimatedBandwidthMB();

          setUniqueSecondsWatched(uniqueSeconds);
          setUniqueMinutesWatched(uniqueMinutes);
          setEstimatedBandwidthMB(bandwidthMB);

          if (tracker.shouldReport()) {
            const payload = tracker.getReportPayload();
            await reportWatchTime(payload);
          }
        }

        // Mark lesson completed at 90%
        if (
          !videoCompleted &&
          !completedRef.current &&
          dur > 0 &&
          ct / dur >= 0.9
        ) {
          completedRef.current = true;
          console.log("🎬 finished video 90%");

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
            // swallow
          }
        }

        maybeMarkWatched(inst, v);
      };

      const onSeeking = () => {
        setCurrentTime(v?.currentTime ? Math.floor(v.currentTime) : 0);
      };

      const onEnded = async () => {
        if (!viewLoggedRef.current) {
          viewLoggedRef.current = true;
          void logView(videoId, roomId, classroomId);
        }

        if (watchTimeTrackerRef.current?.hasUnreportedData()) {
          const payload = watchTimeTrackerRef.current.getReportPayload();
          await reportWatchTime(payload);
        }
      };

      // ✅ NEW: Listen for quality changes
      const qualityChangeHandler = async (evt: any) => {
        console.log("🔍 Quality change event:", evt);

        try {
          const qualitiesData = await inst.api.getVideoQualities();
          console.log("🔍 All qualities:", qualitiesData.qualities); // ✅ Debug

          // ✅ NEW: Try to find quality by event ID first
          let targetQuality = null;

          if (typeof evt === "number" || typeof evt === "string") {
            // Event is a quality ID
            targetQuality = qualitiesData.qualities.find(
              (q) => q.id === Number(evt),
            );
            console.log(`🔍 Found quality by ID ${evt}:`, targetQuality);
          }

          // Fallback: find active quality
          if (!targetQuality) {
            targetQuality = qualitiesData.qualities.find((q) => q.active);
            console.log("🔍 Found active quality:", targetQuality);
          }

          if (targetQuality) {
            // ✅ FIXED: Check bandwidth field (in bps) first, then label
            let bitrate = targetQuality.bitrate;

            // ✅ NEW: Try bandwidth field (convert from bps to kbps)
            if (
              (!bitrate || isNaN(bitrate) || bitrate <= 0) &&
              targetQuality.bandwidth
            ) {
              bitrate = Math.round(targetQuality.bandwidth / 1000);
              console.log(
                `🔍 Converted bandwidth ${targetQuality.bandwidth} bps -> ${bitrate} kbps`,
              );
            }

            // Try parsing from label
            if (!bitrate || isNaN(bitrate) || bitrate <= 0) {
              const match = targetQuality.label?.match(
                /(\d+(?:\.\d+)?)\s*kbps/i,
              );
              if (match) {
                bitrate = parseFloat(match[1]);
                console.log(`🔍 Parsed bitrate from label: ${bitrate} kbps`);
              } else {
                bitrate = 2500;
                console.warn("⚠️ Using fallback bitrate");
              }
            }

            const qualityInfo: QualityInfo = {
              bitrate: bitrate,
              label: targetQuality.label || `${bitrate} kbps`,
              height: targetQuality.height,
              width: targetQuality.width,
            };

            setCurrentBitrate(bitrate);
            setCurrentQuality(qualityInfo);

            watchTimeTrackerRef.current?.setBitrate(bitrate, qualityInfo);

            console.log(
              `🔄 Quality changed: ${qualityInfo.label} @ ${bitrate} kbps`,
            );
          } else {
            console.warn("⚠️ No quality found for event:", evt);
          }
        } catch (error) {
          console.error("❌ Error handling quality change:", error);
        }
      };

      // ✅ NEW: Listen for adaptive changes
      const adaptiveChangeHandler = (evt: any) => {
        const adaptive = evt?.adaptive ?? true;
        setIsAdaptive(adaptive);
        watchTimeTrackerRef.current?.setAdaptive(adaptive);
        console.log(`🔄 Adaptive mode: ${adaptive ? "ON" : "OFF"}`);
      };

      // Event listeners
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

      // ✅ NEW: VdoCipher event listeners
      const qualityUnsub = inst.api.addEventListener(
        "videoQualityChange",
        qualityChangeHandler,
      );
      if (typeof qualityUnsub === "function") cleanups.push(qualityUnsub);

      const adaptiveUnsub = inst.api.addEventListener(
        "videoAdaptivenessChange",
        adaptiveChangeHandler,
      );
      if (typeof adaptiveUnsub === "function") cleanups.push(adaptiveUnsub);

      // Existing status handler
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
  }, [response?.otp, videoId, roomId, classroomId, lessonId, videoCompleted]);

  return {
    iframeRef,
    playerRef,
    hideBtn,
    setHideBtn,
    duration,
    // Watch time data
    uniqueSecondsWatched,
    uniqueMinutesWatched,
    tenantSubdomain,
    // ✅ NEW: Bitrate & bandwidth data
    currentBitrate,
    currentQuality,
    availableQualities,
    isAdaptive,
    estimatedBandwidthMB,
  } as const;
}
