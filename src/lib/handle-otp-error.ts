import { AUTH_ERROR_CODES } from "@/constants/error-codes";
import { toast } from "@/hooks/use-toast";
import { OtpVerifyErrorResponse } from "@/types/auth.types";
import { isAxiosError } from "axios";
import { isOtpExpired, setNewOtpSendTime } from "./utils";

export const getOtpVerifyErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "رمز التأكيد غير صحيح";
  }

  const payload = error.response?.data as OtpVerifyErrorResponse | undefined;
  const code = payload?.code;

  if (code === AUTH_ERROR_CODES.OTP_INVALID) {
    const attempts = payload?.data?.attempts_remaining;
    if (typeof attempts === "number") {
      return `رمز التأكيد غير صحيح. المحاولات المتبقية: ${attempts}`;
    }
    return "رمز التأكيد غير صحيح";
  }

  if (code === AUTH_ERROR_CODES.OTP_LOCKED) {
    const minutes = payload?.data?.locked_for_minutes;
    if (typeof minutes === "number") {
      return `تم قفل المحاولات. حاول مرة أخرى بعد ${minutes} دقيقة`;
    }
    return "تم قفل المحاولات. حاول مرة أخرى لاحقًا";
  }

  if (code === AUTH_ERROR_CODES.OTP_DAILY_LIMIT) {
    const usedToday = payload?.data?.used_today;
    const maxPerDay = payload?.data?.max_per_day;
    if (typeof usedToday === "number" && typeof maxPerDay === "number") {
      return `تم الوصول للحد اليومي لأكواد التأكيد (${usedToday}/${maxPerDay})`;
    }
    return payload?.message || "تم الوصول للحد اليومي لأكواد التأكيد";
  }

  return payload?.message || "رمز التأكيد غير صحيح";
};

export const handleOtpError = (error: unknown): string => {
  const showAndReturn = (description: string) => {
    toast({
      description,
      icon: "error",
    });

    return description;
  };

  if (isAxiosError(error)) {
    const payload = error.response?.data as OtpVerifyErrorResponse | undefined;

    if (payload?.code === AUTH_ERROR_CODES.OTP_LOCKED) {
      const minutes = payload?.data?.locked_for_minutes;

      return showAndReturn(
        typeof minutes === "number"
          ? `تم استهلاك محاولاتك. حاول مرة أخرى بعد ${minutes} دقيقة`
          : "تم استهلاك محاولاتك. حاول مرة أخرى لاحقًا",
      );
    }

    if (payload?.code === AUTH_ERROR_CODES.OTP_DAILY_LIMIT) {
      const usedToday = payload?.data?.used_today;
      const maxPerDay = payload?.data?.max_per_day;

      return showAndReturn(
        typeof usedToday === "number" && typeof maxPerDay === "number"
          ? `تم الوصول للحد اليومي لأكواد التأكيد (${usedToday}/${maxPerDay})`
          : payload?.message || "تم الوصول للحد اليومي لإرسال OTP",
      );
    }

    if (error.response?.status === 404) {
      return showAndReturn("لا يوجد طالب او ولى امر مسجل بهذا الرقم");
    }

    if (error.response?.status === 405) {
      const { isExpired } = isOtpExpired();

      const remainingSec =
        error.response?.data?.error?.data?.cooldown_remaining_sec ||
        error.response?.data?.data?.cooldown_remaining_sec;

      const message = `انتظر ${
        remainingSec ? remainingSec : 60
      } ثانية حتى تستطيع ارسال otp مرة اخري`;

      if (isExpired) {
        setNewOtpSendTime({
          customDuration: remainingSec,
        });
      }

      return showAndReturn(message);
    }

    if (error.response?.status === 406) {
      return showAndReturn("تم الوصول للحد الاقصى اليومى لارسال otp");
    }

    if (error.response?.status === 429) {
      return showAndReturn(
        payload?.message || "تم الوصول للحد اليومي لإرسال OTP",
      );
    }

    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.response?.data?.error ||
      error.message;

    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return showAndReturn(apiMessage);
    }
  }

  return showAndReturn("الرقم غلط او بعتنالك otp من قبل");
};
