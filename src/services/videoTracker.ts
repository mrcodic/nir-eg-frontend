// services/videoTracker.ts

function parseBitrateFromLabel(label: string | undefined): number | null {
  if (!label) return null;

  const kbpsMatch = label.match(/(\d+(?:\.\d+)?)\s*kbps/i);
  if (kbpsMatch) return parseFloat(kbpsMatch[1]);

  const mbpsMatch = label.match(/(\d+(?:\.\d+)?)\s*mbps/i);
  if (mbpsMatch) return parseFloat(mbpsMatch[1]) * 1000;

  return null;
}

interface QualityInfo {
  bitrate: number;
  label: string;
  height?: number;
  width?: number;
}

class WatchTimeTracker {
  // ✅ CHANGED: Track unique (segment + bitrate) combinations
  // Key: `${segmentIndex}-${bitrate}`, allows same segment at different qualities
  private watchedSegmentQualities = new Set<string>();

  // ✅ KEPT: Still track unique segments for watch TIME (not bandwidth)
  private watchedSegments = new Set<number>();

  private segmentSize: number;
  private videoId: string;
  private tenantSubdomain: string;
  private lastReportTime = 0;
  private reportInterval = 10000;
  private videoDuration: number | null = null;
  private lastReportedSeconds = 0;
  private lastReportedBandwidth = 0; // ✅ NEW: Track reported bandwidth

  private currentBitrate: number = 2500;
  private currentQuality: QualityInfo | null = null;
  private isAdaptive: boolean = true;

  constructor(videoId: string, tenantSubdomain: string, segmentSize = 5) {
    this.videoId = videoId;
    this.tenantSubdomain = tenantSubdomain;
    this.segmentSize = segmentSize;
  }

  setVideoDuration(duration: number): void {
    this.videoDuration = duration;
  }

  setBitrate(bitrate: number, quality?: QualityInfo): void {
    if (bitrate && !isNaN(bitrate) && bitrate > 0) {
      this.currentBitrate = bitrate;
      console.log(
        `🎬 Bitrate set: ${bitrate} kbps${quality?.label ? ` (${quality.label})` : ""}`,
      );
    } else {
      console.warn(
        `⚠️ Invalid bitrate: ${bitrate}, keeping current ${this.currentBitrate} kbps`,
      );
      return;
    }

    if (quality) {
      this.currentQuality = { ...quality, bitrate: this.currentBitrate };
    }
  }

  setAdaptive(adaptive: boolean): void {
    this.isAdaptive = adaptive;
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

    // ✅ Track unique watch TIME (capped, no duplicates)
    this.watchedSegments.add(cappedSegmentIndex);

    // ✅ Track unique (segment + bitrate) for BANDWIDTH
    // Same segment at different quality = re-download = more bandwidth
    const segmentQualityKey = `${cappedSegmentIndex}-${this.currentBitrate}`;
    const isNewCombination =
      !this.watchedSegmentQualities.has(segmentQualityKey);

    if (isNewCombination) {
      this.watchedSegmentQualities.add(segmentQualityKey);
      console.log(
        `📥 New download: Segment ${cappedSegmentIndex} @ ${this.currentBitrate} kbps`,
      );
    }
  }

  // ✅ Watch time: Only unique segments (time-based, capped at video duration)
  getUniqueSecondsWatched(): number {
    const calculatedSeconds = this.watchedSegments.size * this.segmentSize;
    if (this.videoDuration) {
      return Math.min(calculatedSeconds, this.videoDuration);
    }
    return calculatedSeconds;
  }

  getUniqueMinutesWatched(): number {
    return Math.floor(this.getUniqueSecondsWatched() / 60);
  }

  // ✅ UPDATED: Bandwidth counts ALL (segment + quality) combinations
  // No duration cap here! Same segment at 2 qualities = 2x download
  getEstimatedBandwidthMB(): number {
    let totalKilobits = 0;

    for (const key of this.watchedSegmentQualities) {
      // key format: "segmentIndex-bitrate"
      const bitrate = parseInt(key.split("-")[1]);

      if (bitrate && !isNaN(bitrate) && bitrate > 0) {
        totalKilobits += bitrate * this.segmentSize;
      }
    }

    const megabytes = totalKilobits / 8 / 1024;
    return Math.round(megabytes * 100) / 100;
  }

  getAverageBitrate(): number {
    if (this.watchedSegmentQualities.size === 0) return this.currentBitrate;

    let sum = 0;
    let count = 0;

    for (const key of this.watchedSegmentQualities) {
      const bitrate = parseInt(key.split("-")[1]);
      if (bitrate && !isNaN(bitrate) && bitrate > 0) {
        sum += bitrate;
        count++;
      }
    }

    return count > 0 ? Math.round(sum / count) : this.currentBitrate;
  }

  // ✅ NEW: Show quality distribution (seconds per bitrate)
  getQualityDistribution(): { [bitrate: string]: number } {
    const distribution: { [bitrate: string]: number } = {};

    for (const key of this.watchedSegmentQualities) {
      const bitrate = parseInt(key.split("-")[1]);
      if (bitrate && !isNaN(bitrate) && bitrate > 0) {
        const qualityKey = `${bitrate}kbps`;
        distribution[qualityKey] =
          (distribution[qualityKey] || 0) + this.segmentSize;
      }
    }

    return distribution;
  }

  // ✅ NEW: Get total downloads (including re-downloads at different quality)
  getTotalDownloads(): number {
    return this.watchedSegmentQualities.size;
  }

  shouldReport(): boolean {
    const now = Date.now();
    const currentSeconds = this.getUniqueSecondsWatched();
    const currentBandwidth = this.getEstimatedBandwidthMB();

    if (now - this.lastReportTime >= this.reportInterval) {
      // ✅ Report if new watch time OR new bandwidth (quality change)
      if (
        currentSeconds > this.lastReportedSeconds ||
        currentBandwidth > this.lastReportedBandwidth
      ) {
        this.lastReportTime = now;
        return true;
      }
    }
    return false;
  }

  hasUnreportedData(): boolean {
    const currentSeconds = this.getUniqueSecondsWatched();
    const currentBandwidth = this.getEstimatedBandwidthMB();
    return (
      currentSeconds > this.lastReportedSeconds ||
      currentBandwidth > this.lastReportedBandwidth
    );
  }

  getReportPayload() {
    const currentSeconds = this.getUniqueSecondsWatched();
    const secondsGained = currentSeconds - this.lastReportedSeconds;
    const bandwidthMB = this.getEstimatedBandwidthMB();
    const bandwidthGainedMB =
      Math.round((bandwidthMB - this.lastReportedBandwidth) * 100) / 100;
    const avgBitrate = this.getAverageBitrate();

    console.log(
      `📊 Report: +${secondsGained}s | +${bandwidthGainedMB} MB | Avg: ${avgBitrate} kbps | Downloads: ${this.getTotalDownloads()}`,
    );

    this.lastReportedSeconds = currentSeconds;
    this.lastReportedBandwidth = bandwidthMB;

    return {
      video_id: this.videoId,
      tenant_subdomain: this.tenantSubdomain,
      seconds_to_add: secondsGained,
      bandwidth_mb_to_add: bandwidthGainedMB, // ✅ Delta bandwidth
      total_bandwidth_mb: bandwidthMB, // ✅ Total so far
      average_bitrate_kbps: avgBitrate,
      current_quality: this.currentQuality?.label || null,
      is_adaptive: this.isAdaptive,
      quality_distribution: this.getQualityDistribution(),
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
      } catch {}
    }
  } catch {}
}

export {
  parseBitrateFromLabel,
  reportWatchTime,
  sendPendingReports,
  WatchTimeTracker,
};
export type { QualityInfo };
