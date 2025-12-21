export const TIMER_DURATION = 180; // 3 minutes

export const OTP_STORAGE_KEY = `email_otp_expires_at`;
// export const getStorageKey = (email: string) => `email_otp_expires_at:${email}`;

export const getRemainingSeconds = () => {
  if (typeof window === "undefined") return 0;

  const expiresAt = Number(localStorage.getItem(OTP_STORAGE_KEY));

  if (!expiresAt) return 0;

  const diff = Math.floor((expiresAt - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
};

export const startNewTimer = () => {
  if (typeof window === "undefined") return 0;

  const expiresAt = Date.now() + TIMER_DURATION * 1000;

  localStorage.setItem(OTP_STORAGE_KEY, String(expiresAt));

  return TIMER_DURATION;
};
