import { OTP_SEND_TIME_KEY } from "@/constants";
import { setNewOtpSendTime } from "@/lib/utils";

type ExpiryInput = {
  expires_at?: string | null;
};

const parseServerExpiry = (raw?: string | null): Date | null => {
  if (!raw) return null;

  // Support microseconds from backend like: 2026-06-01T12:19:53.758909Z
  // by trimming fractional part to milliseconds for reliable JS parsing.
  const normalized = raw.replace(/\.(\d{3})\d+(?=Z$)/, ".$1");
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

export function resolveOtpExpiryTimestamp(payload?: ExpiryInput | null): Date {
  const expiryFromServer = parseServerExpiry(payload?.expires_at);
  const hasValidServerExpiry =
    expiryFromServer instanceof Date &&
    !Number.isNaN(expiryFromServer.getTime()) &&
    expiryFromServer.getTime() > Date.now();

  if (hasValidServerExpiry) {
    localStorage.setItem(
      OTP_SEND_TIME_KEY,
      expiryFromServer.getTime().toString(),
    );
    return expiryFromServer;
  }

  return setNewOtpSendTime();
}
