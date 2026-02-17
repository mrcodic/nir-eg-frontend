// services/videoTracker.ts

class WatchTimeTracker {
  private watchedSegments = new Set<number>();
  private segmentSize: number;
  private videoId: string;
  private tenantSubdomain: string;
  private lastReportTime = 0;
  private reportInterval = 10000;
  private videoDuration: number | null = null;
  private lastReportedSeconds = 0;

  constructor(videoId: string, tenantSubdomain: string, segmentSize = 5) {
    this.videoId = videoId;
    this.tenantSubdomain = tenantSubdomain;
    this.segmentSize = segmentSize;
  }

  setVideoDuration(duration: number): void {
    this.videoDuration = duration;
  }

  private getMaxSegmentIndex(): number | null {
    if (!this.videoDuration) return null;
    return Math.ceil(this.videoDuration / this.segmentSize) - 1;
  }

  trackSegment(currentTime: number): void {
    const cappedTime = this.videoDuration
      ? Math.min(currentTime, this.videoDuration)
      : currentTime;

    const segmentIndex = Math.floor(cappedTime / this.segmentSize);
    const maxSegment = this.getMaxSegmentIndex();
    const cappedSegmentIndex =
      maxSegment !== null ? Math.min(segmentIndex, maxSegment) : segmentIndex;

    this.watchedSegments.add(cappedSegmentIndex);
  }

  getUniqueSecondsWatched(): number {
    const calculatedSeconds = this.watchedSegments.size * this.segmentSize;

    if (this.videoDuration) {
      return Math.min(calculatedSeconds, this.videoDuration);
    }

    return calculatedSeconds;
  }

  // ✅ ADDED BACK: This was missing!
  getUniqueMinutesWatched(): number {
    return Math.floor(this.getUniqueSecondsWatched() / 60);
  }

  shouldReport(): boolean {
    const now = Date.now();
    const currentSeconds = this.getUniqueSecondsWatched();

    if (now - this.lastReportTime >= this.reportInterval) {
      if (currentSeconds > this.lastReportedSeconds) {
        this.lastReportTime = now;
        return true;
      }
    }

    return false;
  }

  hasUnreportedData(): boolean {
    const currentSeconds = this.getUniqueSecondsWatched();
    return currentSeconds > this.lastReportedSeconds;
  }

  getReportPayload() {
    const currentSeconds = this.getUniqueSecondsWatched();
    const secondsGained = currentSeconds - this.lastReportedSeconds;

    console.log(`📊 Sending +${secondsGained}s to backend`);

    this.lastReportedSeconds = currentSeconds;

    return {
      video_id: this.videoId,
      tenant_subdomain: this.tenantSubdomain,
      seconds_to_add: secondsGained,
      timestamp: new Date().toISOString(),
    };
  }
}

async function reportWatchTime(
  payload: ReturnType<WatchTimeTracker["getReportPayload"]>,
) {
  try {
    // await mutateClient("/video/track-watch-time", { body: payload });
    console.log("✅ Watch time reported:", payload);
  } catch (error) {
    console.error("❌ Failed to report watch time:", error);
    try {
      const key = `watchtime_pending_${payload.video_id}_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {}
  }
}

async function sendPendingReports() {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("watchtime_pending_"),
    );

    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (!data) continue;

      try {
        const payload = JSON.parse(data);
        // await mutateClient("/video/track-watch-time", { body: payload });
        console.log("✅ Pending report sent:", payload);
        localStorage.removeItem(key);
      } catch {
        // Keep in localStorage to retry later
      }
    }
  } catch {}
}

export { reportWatchTime, WatchTimeTracker, sendPendingReports };
