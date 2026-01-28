"use client";

import { OTP_SEND_TIME_KEY } from "@/constants";
import { mutateClient } from "@/helpers/post-client";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { useTimer } from "react-timer-hook";
import { isOtpExpired, setNewOtpSendTime } from "../lib/utils";
import { useToast } from "./use-toast";
import { handleOtpError } from "@/lib/handle-otp-error";

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
        handleOtpError(e);

        // server otp time still active if error is 405
        if (isAxiosError(e) && e.status === 405) {
          console.log("server otp time still active");

          const newTimeStamp =
            new Date().getTime() +
            (e?.response?.data?.error?.data?.cooldown_remaining_sec ||
              e?.response?.data?.data?.cooldown_remaining_sec ||
              60) *
              1000;

          restart(new Date(newTimeStamp));
          setStart(true);
        }
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
