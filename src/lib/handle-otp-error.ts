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

  return payload?.message || "رمز التأكيد غير صحيح";
};

export const handleOtpError = (error: unknown) => {
  if (isAxiosError(error)) {
    const payload = error.response?.data as OtpVerifyErrorResponse | undefined;
    if (payload?.code === AUTH_ERROR_CODES.OTP_LOCKED) {
      const minutes = payload?.data?.locked_for_minutes;
      toast({
        description:
          typeof minutes === "number"
            ? `تم استهلاك محاولاتك. حاول مرة أخرى بعد ${minutes} دقيقة`
            : "تم استهلاك محاولاتك. حاول مرة أخرى لاحقًا",
        icon: "error",
      });
      return;
    }
  }

  if (isAxiosError(error) && error?.response?.status === 404) {
    toast({
      description: "لا يوجد طالب او ولى امر مسجل بهذا الرقم",
      icon: "error",
    });
  } else if (isAxiosError(error) && error?.response?.status === 405) {
    const { isExpired } = isOtpExpired();
    const remainingSec =
      error?.response?.data?.error?.data?.cooldown_remaining_sec ||
      error?.response?.data?.data?.cooldown_remaining_sec;
    toast({
      description: `انتظر ${
        remainingSec ? remainingSec : 60
      } ثانية حتى تستطيع ارسال otp مرة اخري`,
      icon: "error",
    });

    if (isExpired) {
      setNewOtpSendTime({
        customDuration: remainingSec,
      });
    }
  } else if (isAxiosError(error) && error?.status === 406) {
    toast({
      description: "تم الوصول للحد الاقصى اليومى لارسال otp",
      icon: "error",
    });
  } else {
    toast({
      description: "الرقم غلط او بعتنالك otp من قبل",
      icon: "error",
    });
  }
};
