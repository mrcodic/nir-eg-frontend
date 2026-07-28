import { extractTenantFromHost } from "@/helpers/fetchers/fetch-utils";
import { isProd } from "@/utils/isProd";

export const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
  }
  return null;
};

export function convertMinutes(seconds: number) {
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const durationParts: string[] = [];

  if (hours) durationParts.push(`${hours} ساعة`);
  if (minutes) durationParts.push(`${minutes} دقيقة`);
  if (!hours && (remainingSeconds || !durationParts.length)) {
    durationParts.push(`${remainingSeconds} ثانية`);
  }

  return durationParts.join(" و ");
}

export function formatDateToArabic(dateString) {
  if (window === undefined) return dateString;
  const date = new Date(dateString);

  // Format to YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return ` ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getRedirectOrigin(host: string) {
  if (host.startsWith("http://") || host.startsWith("https://")) {
    return host;
  }

  return `${isProd ? "https" : "http"}://${host}`;
}

export function redirectUrl({
  bundleId,
  courseId,
  itemId,
  booksPage,
}: {
  bundleId?: string | number;
  courseId?: string | number;
  itemId?: string | number;
  booksPage?: boolean;
}) {
  const redirectOrigin = getRedirectOrigin(extractTenantFromHost().host);

  let url = "";

  if (bundleId) {
    url = `${redirectOrigin}/bundles/bundle-details/${bundleId}`;
  } else if (courseId) {
    url = `${redirectOrigin}/bundles/${courseId}`;
  } else if (itemId) {
    return [
      `${redirectOrigin}/orders?orderType=store&payment=success`,
      `${redirectOrigin}/store/${itemId}` + "?payment=failed",
    ];
  } else if (booksPage) {
    url = `${redirectOrigin}/store`;
  }

  return [url + "?payment=success", url + "?payment=failed"];
}

export const convertDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  let minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "مساءً" : "صباحًا";
  hours = hours % 12 || 12;
  const formatted = `${day}/${month}/${year} | ${hours}:${minutes} ${period}`;
  return formatted;
};

export function secondsToHms(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (num: number) => String(num).padStart(2, "0");

  if (h === 0) {
    return `${pad(m)}:${pad(s)}`;
  }

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export const mapTypeToText = (type) => {
  switch (type) {
    case 3:
      return "سنتر";
    case 4:
      return "اونلاين";
    case 5:
      return "اكواد سنتر";
    default:
      return "الطالب";
  }
};

export const getRemainingTimeArabic = (expiresAt: string | Date) => {
  const now = new Date();
  const expiry = new Date(expiresAt);

  const diffMs = expiry.getTime() - now.getTime();
  if (diffMs <= 0) return "انتهى الوقت";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `باقي ${days} يوم${days > 1 ? "ًا" : ""}`;
  }

  if (hours > 0) {
    return `باقي ${hours} ساعة${hours > 1 ? "" : ""}`;
  }

  return `باقي ${minutes} دقيقة`;
};

export function normalizeYouTubeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    // youtu.be/VIDEO_ID
    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    }

    // youtube.com/watch?v=VIDEO_ID
    if (parsed.searchParams.has("v")) {
      videoId = parsed.searchParams.get("v");
    }

    // youtube.com/embed/VIDEO_ID
    if (parsed.pathname.startsWith("/embed/")) {
      videoId = parsed.pathname.split("/embed/")[1];
    }

    // youtube.com/shorts/VIDEO_ID
    if (parsed.pathname.startsWith("/shorts/")) {
      videoId = parsed.pathname.split("/shorts/")[1];
    }

    // youtube.com/v/VIDEO_ID (legacy)
    if (parsed.pathname.startsWith("/v/")) {
      videoId = parsed.pathname.split("/v/")[1];
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
