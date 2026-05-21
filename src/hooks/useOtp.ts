"use client";

import { OTP_SEND_TIME_KEY } from "@/constants";
import { AUTH_ERROR_CODES } from "@/constants/error-codes";
import { handleOtpError } from "@/lib/handle-otp-error";
import { sendAuthOtpCode } from "@/services/auth.service";
import { isOtpExpired, setNewOtpSendTime } from "@/lib/utils";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { useTimer } from "react-timer-hook";
import { useToast } from "./use-toast";

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

        const expiryFromServer = payload?.expires_at
          ? new Date(payload.expires_at)
          : null;
        const hasValidServerExpiry =
          expiryFromServer instanceof Date &&
          !Number.isNaN(expiryFromServer.getTime()) &&
          expiryFromServer.getTime() > Date.now();

        if (hasValidServerExpiry) {
          localStorage.setItem(
            OTP_SEND_TIME_KEY,
            expiryFromServer.getTime().toString(),
          );
          restart(expiryFromServer);
        } else {
          const newTime = setNewOtpSendTime();
          restart(newTime);
        }

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
