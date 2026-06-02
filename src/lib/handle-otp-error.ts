import { AUTH_ERROR_CODES } from "@/constants/error-codes";
import { toast } from "@/hooks/use-toast";
import { OtpVerifyErrorResponse } from "@/types/auth.types";
import { isAxiosError } from "axios";
import { isOtpExpired, setNewOtpSendTime } from "./otp-timer";

const OTP_INVALID_MESSAGE = "رمز التأكيد غير صحيح";
const OTP_NOT_FOUND_MESSAGE =
  "انتهت صلاحية رمز التحقق أو لم يتم إرساله. اطلب رمزًا جديدًا";
const OTP_DAILY_LIMIT_MESSAGE = "تم الوصول للحد اليومي لأكواد التأكيد";
const OTP_MONTHLY_LIMIT_MESSAGE = "تم الوصول للحد الشهري لأكواد التأكيد";
const OTP_SEND_LIMIT_MESSAGE = "تم الوصول للحد اليومي لإرسال OTP";
const OTP_NOT_REGISTERED_PHONE_MESSAGE =
  "لا يوجد طالب او ولى امر مسجل بهذا الرقم";
const OTP_FALLBACK_MESSAGE = "الرقم غلط او بعتنالك otp من قبل";

const getOtpErrorPayload = (
  error: unknown,
): OtpVerifyErrorResponse | undefined => {
  if (!isAxiosError(error)) return undefined;
  return error.response?.data as OtpVerifyErrorResponse | undefined;
};

export const getOtpCooldownSeconds = (error: unknown): number | null => {
  const payload = getOtpErrorPayload(error);
  const remainingSec =
    payload?.data?.cooldown_remaining_sec ??
    (isAxiosError(error)
      ? error.response?.data?.error?.data?.cooldown_remaining_sec
      : undefined);

  return typeof remainingSec === "number" ? remainingSec : null;
};

export const getOtpErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return OTP_INVALID_MESSAGE;
  }

  const payload = getOtpErrorPayload(error);
  const code = payload?.code;

  if (code === AUTH_ERROR_CODES.OTP_INVALID) {
    const attempts = payload?.data?.attempts_remaining;
    if (typeof attempts === "number") {
      return `${OTP_INVALID_MESSAGE}. المحاولات المتبقية: ${attempts}`;
    }
    return OTP_INVALID_MESSAGE;
  }

  if (code === AUTH_ERROR_CODES.OTP_LOCKED) {
    const minutes = payload?.data?.locked_for_minutes;
    if (typeof minutes === "number") {
      return `تم قفل المحاولات. حاول مرة أخرى بعد ${minutes} دقيقة`;
    }
    return "تم قفل المحاولات. حاول مرة أخرى لاحقًا";
  }

  if (code === AUTH_ERROR_CODES.OTP_COOLDOWN) {
    const remainingSec = getOtpCooldownSeconds(error);
    return `انتظر ${remainingSec ?? 60} ثانية حتى تستطيع ارسال otp مرة اخري`;
  }

  if (code === AUTH_ERROR_CODES.OTP_DAILY_LIMIT) {
    const usedToday = payload?.data?.used_today;
    const maxPerDay = payload?.data?.max_per_day;
    if (typeof usedToday === "number" && typeof maxPerDay === "number") {
      return `${OTP_DAILY_LIMIT_MESSAGE} (${usedToday}/${maxPerDay})`;
    }
    return payload?.message || OTP_DAILY_LIMIT_MESSAGE;
  }

  if (code === AUTH_ERROR_CODES.OTP_MONTHLY_LIMIT) {
    const usedThisMonth = payload?.data?.used_this_month;
    const maxPerMonth = payload?.data?.max_per_month;
    const remainingThisMonth = payload?.data?.remaining_this_month;

    if (
      typeof usedThisMonth === "number" &&
      typeof maxPerMonth === "number" &&
      typeof remainingThisMonth === "number"
    ) {
      return `${OTP_MONTHLY_LIMIT_MESSAGE} (${usedThisMonth}/${maxPerMonth}) - المتبقي هذا الشهر: ${remainingThisMonth}`;
    }

    if (
      typeof usedThisMonth === "number" &&
      typeof maxPerMonth === "number"
    ) {
      return `${OTP_MONTHLY_LIMIT_MESSAGE} (${usedThisMonth}/${maxPerMonth})`;
    }

    return payload?.message || OTP_MONTHLY_LIMIT_MESSAGE;
  }

  if (code === AUTH_ERROR_CODES.OTP_NOT_FOUND) {
    return OTP_NOT_FOUND_MESSAGE;
  }

  if (error.response?.status === 404) {
    return OTP_NOT_REGISTERED_PHONE_MESSAGE;
  }

  if (error.response?.status === 405) {
    const remainingSec = getOtpCooldownSeconds(error);
    return `انتظر ${remainingSec ?? 60} ثانية حتى تستطيع ارسال otp مرة اخري`;
  }

  if (error.response?.status === 406) {
    return "تم الوصول للحد الاقصى اليومى لارسال otp";
  }

  if (error.response?.status === 429) {
    return payload?.message || OTP_SEND_LIMIT_MESSAGE;
  }

  const apiMessage =
    error.response?.data?.message ||
    error.response?.data?.error?.message ||
    error.response?.data?.error ||
    error.message;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return OTP_FALLBACK_MESSAGE;
};

export const handleOtpError = (error: unknown): string => {
  if (
    isAxiosError(error) &&
    (error.response?.status === 405 ||
      getOtpErrorPayload(error)?.code === AUTH_ERROR_CODES.OTP_COOLDOWN)
  ) {
    const { isExpired } = isOtpExpired();
    const remainingSec = getOtpCooldownSeconds(error);

    if (isExpired) {
      setNewOtpSendTime({
        customDuration: remainingSec ?? undefined,
      });
    }
  }

  const description = getOtpErrorMessage(error);

  toast({
    description,
    icon: "error",
  });

  return description;
};

