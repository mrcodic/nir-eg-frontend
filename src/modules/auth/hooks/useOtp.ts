"use client";

import { OTP_SEND_TIME_KEY } from "@/constants";
import { AUTH_ERROR_CODES } from "@/constants/error-codes";
import { useToast } from "@/hooks/use-toast";
import { handleOtpError } from "@/lib/handle-otp-error";
import { isOtpExpired, resolveOtpExpiryTimestamp } from "@/lib/otp-timer";
import { sendAuthOtpCode } from "@/services/auth.service";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { useTimer } from "react-timer-hook";

function useOtp() {
  const { otpSendTime, isExpired } = isOtpExpired();
  const [resending, setResending] = useState(false);
  const [lastOtpIsNew, setLastOtpIsNew] = useState<boolean | null>(null);
  const { toast } = useToast();

  const [start, setStart] = useState(!isExpired);

  const { minutes, restart, seconds } = useTimer({
    expiryTimestamp: otpSendTime,
    onExpire: () => {
      setStart(false);
      localStorage.removeItem(OTP_SEND_TIME_KEY);
    },
    autoStart: start,
  });

  const sendOtp = useCallback(
    async (phone: string) => {
      try {
        if (typeof window === "undefined") return null;

        setResending(true);

        const res = await sendAuthOtpCode(phone);

        const payload = res?.data ?? {
          is_new: res?.is_new,
          expires_at: res?.expires_at,
          otp_code: res?.otp_code,
        };

        const expiry = resolveOtpExpiryTimestamp(payload);
        restart(expiry);

        setStart(true);
        setLastOtpIsNew(
          typeof payload?.is_new === "boolean" ? payload.is_new : null,
        );

        if (res.status && res.code === AUTH_ERROR_CODES.OTP_SENT) {
          toast({
            description: "بعتنالك otp تاني",
            icon: "success",
          });
        }

        return res;
      } catch (error) {
        handleOtpError(error);

        if (isAxiosError(error) && error.status === 405) {
          const newTimeStamp =
            Date.now() +
            (error?.response?.data?.error?.data?.cooldown_remaining_sec ||
              error?.response?.data?.data?.cooldown_remaining_sec ||
              60) *
              1000;

          restart(new Date(newTimeStamp));
          setStart(true);
        }

        return null;
      } finally {
        setResending(false);
      }
    },
    [restart, toast],
  );

  return {
    sendOtp,
    start,
    setStart,
    minutes,
    seconds,
    resending,
    lastOtpIsNew,
    otpSendTime,
    isExpired,
  };
}

export default useOtp;
