import { mutateClient } from "@/helpers/post-client";

class WatchTimeTracker {
  private watchedSegments = new Set<number>();
  private segmentSize: number;
  private videoId: string;
  private tenantSubdomain: string;
  private lastReportTime = 0;
  private reportInterval = 15000;

  constructor(videoId: string, tenantSubdomain: string, segmentSize = 10) {
    this.videoId = videoId;
    this.tenantSubdomain = tenantSubdomain;
    this.segmentSize = segmentSize;
  }

  trackSegment(currentTime: number): void {
    const segmentIndex = Math.floor(currentTime / this.segmentSize);
    this.watchedSegments.add(segmentIndex);
  }

  getUniqueSecondsWatched(): number {
    return this.watchedSegments.size * this.segmentSize;
  }

  getUniqueMinutesWatched(): number {
    return Math.floor(this.getUniqueSecondsWatched() / 60);
  }

  getWatchedSegments(): number[] {
    return Array.from(this.watchedSegments).sort((a, b) => a - b);
  }

  shouldReport(): boolean {
    const now = Date.now();
    if (now - this.lastReportTime >= this.reportInterval) {
      this.lastReportTime = now;
      return true;
    }
    return false;
  }

  getReportPayload() {
    return {
      video_id: this.videoId,
      tenant_subdomain: this.tenantSubdomain,
      segments_watched: this.getWatchedSegments(),
      unique_seconds: this.getUniqueSecondsWatched(),
      unique_minutes: this.getUniqueMinutesWatched(),
      segment_size: this.segmentSize,
      timestamp: new Date().toISOString(),
    };
  }
}

async function reportWatchTime(
  payload: ReturnType<WatchTimeTracker["getReportPayload"]>,
) {
  try {
    await mutateClient("/video/track-watch-time", { body: payload });
  } catch (error) {
    console.error("Failed to report watch time:", error);
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
        await mutateClient("/video/track-watch-time", { body: payload });
        localStorage.removeItem(key);
      } catch {}
    }
  } catch {}
}

export { reportWatchTime, WatchTimeTracker, sendPendingReports };
