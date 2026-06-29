import {
  RESET_PASSWORD_OTP_GATE_KEY,
  RESET_PASSWORD_OTP_GATE_TTL_MS,
} from "@/constants";

type ResetPasswordOtpGate = {
  phone: string;
  expiresAt: number;
};

const isBrowser = () => typeof window !== "undefined";

export const setResetPasswordOtpGate = (phone: string): void => {
  if (!isBrowser() || !phone) return;

  const payload: ResetPasswordOtpGate = {
    phone,
    expiresAt: Date.now() + RESET_PASSWORD_OTP_GATE_TTL_MS,
  };

  window.sessionStorage.setItem(
    RESET_PASSWORD_OTP_GATE_KEY,
    JSON.stringify(payload),
  );
};

export const clearResetPasswordOtpGate = (): void => {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(RESET_PASSWORD_OTP_GATE_KEY);
};

export const hasValidResetPasswordOtpGate = (phone: string): boolean => {
  if (!isBrowser() || !phone) return false;

  const raw = window.sessionStorage.getItem(RESET_PASSWORD_OTP_GATE_KEY);
  if (!raw) return false;

  try {
    const payload = JSON.parse(raw) as ResetPasswordOtpGate;
    const isValid =
      payload.phone === phone &&
      typeof payload.expiresAt === "number" &&
      payload.expiresAt > Date.now();

    if (!isValid) {
      clearResetPasswordOtpGate();
    }

    return isValid;
  } catch {
    clearResetPasswordOtpGate();
    return false;
  }
};
