import { COOLDOWN_DURATION, OTP_SEND_TIME_KEY } from "@/constants";

type ExpiryInput = {
  expires_at?: string | null;
};

export const getInitialExpiryTime = () => {
  if (typeof window == "undefined") return new Date();

  const otpSendTime = localStorage.getItem(OTP_SEND_TIME_KEY);

  if (otpSendTime) {
    const sendTimestamp = parseInt(otpSendTime);
    const currentTime = Date.now();

    if (sendTimestamp < currentTime) {
      localStorage.removeItem(OTP_SEND_TIME_KEY);
      return new Date();
    } else {
      return new Date(sendTimestamp);
    }
  }

  return new Date();
};

export const isOtpExpired = () => {
  const otpSendTime = getInitialExpiryTime();

  return { otpSendTime, isExpired: otpSendTime.getTime() < Date.now() + 1000 };
};

export const setNewOtpSendTime = ({
  customDuration,
}: {
  customDuration?: number;
} = {}) => {
  const newTime = new Date();
  newTime.setSeconds(
    newTime.getSeconds() + (customDuration || COOLDOWN_DURATION),
  );

  localStorage.setItem(OTP_SEND_TIME_KEY, newTime.getTime().toString());
  return newTime;
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
  console.log("expiryFromServer : ", expiryFromServer);

  const hasValidServerExpiry =
    expiryFromServer instanceof Date &&
    !Number.isNaN(expiryFromServer.getTime()) &&
    expiryFromServer.getTime() > Date.now();

  console.log("hasValidServerExpiry : ", hasValidServerExpiry);

  if (hasValidServerExpiry) {
    localStorage.setItem(
      OTP_SEND_TIME_KEY,
      expiryFromServer.getTime().toString(),
    );
    return expiryFromServer;
  }

  return setNewOtpSendTime();
}
