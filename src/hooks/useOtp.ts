"use client";

import { OTP_SEND_TIME_KEY } from "@/constants";
import { mutateClient } from "@/helpers/post-client";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { useTimer } from "react-timer-hook";
import { isOtpExpired, setNewOtpSendTime } from "../lib/utils";
import { useToast } from "./use-toast";

function useOtp() {
  const { otpSendTime, isExpired } = isOtpExpired();
  const [resending, setResending] = useState(false);
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
        if (typeof window == "undefined") return;
        //  const { otpSendTime, isExpired } = isOtpExpired();

        setResending(true);

        const res = await mutateClient("/otp/request", {
          body: { phone },
        });

        const newTime = setNewOtpSendTime();

        restart(newTime);
        setStart(true);

        if (res.status) {
          console.log(res);
          toast({
            description: "بعتنالك otp تاني ",
            icon: "success",
          });
        }
      } catch (e) {
        console.log(e);
        toast({
          description:
            isAxiosError(e) && e.status === 500
              ? "حدث خطأ اثناء التحقق من رمز التأكيد"
              : "الرقم غلط او بعتنالك otp من قبل",
          icon: "error",
        });
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
    otpSendTime,
    isExpired,
  };
}

export default useOtp;
