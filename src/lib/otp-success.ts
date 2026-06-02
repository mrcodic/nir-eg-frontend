import { OtpSendPayload, OtpSendResponse } from "@/types/auth.types";

function getOtpSendPayload(
  response?: OtpSendResponse | null,
): OtpSendPayload | null {
  if (!response) return null;

  if (response.data) {
    return response.data;
  }

  if (!response.expires_at && !response.otp_code && response.is_new === undefined) {
    return null;
  }

  return {
    is_new: response.is_new,
    expires_at: response.expires_at ?? "",
    otp_code: response.otp_code,
  };
}

export function getOtpSendSuccessMessage(
  response?: OtpSendResponse | null,
  fallback = "تم إرسال كود التحقق",
): string {
  const payload = getOtpSendPayload(response);

  const remainingThisMonth = payload?.remaining_this_month;
  const usedThisMonth = payload?.used_this_month;
  const maxPerMonth = payload?.max_per_month;

  if (
    typeof remainingThisMonth === "number" &&
    typeof usedThisMonth === "number" &&
    typeof maxPerMonth === "number"
  ) {
    return `${fallback}. المتبقي هذا الشهر: ${remainingThisMonth} من ${maxPerMonth} (${usedThisMonth} مستخدم)`;
  }

  if (
    typeof remainingThisMonth === "number" &&
    typeof maxPerMonth === "number"
  ) {
    return `${fallback}. المتبقي هذا الشهر: ${remainingThisMonth} من ${maxPerMonth}`;
  }

  return fallback;
}

