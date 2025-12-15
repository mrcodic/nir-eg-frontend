"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { EmailVerifyFormData } from "@/lib/schemas/subscribe.schema";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { OtpInput } from "../shared";
import NavigationButtons from "../shared/NavigationButtons";

interface EmailVerifyStepProps {
  form: UseFormReturn<EmailVerifyFormData>;
  email: string;
  onNext: () => void;
  onPrevious: () => void;
}

const TIMER_DURATION = 180; // 3 minutes

/* ---------------------------------------------
 * Storage helpers (per email)
 * ------------------------------------------- */

const getStorageKey = (email: string) => `email_otp_expires_at:${email}`;

const getRemainingSeconds = (email: string) => {
  if (typeof window === "undefined") return 0;

  const expiresAt = Number(localStorage.getItem(getStorageKey(email)));

  if (!expiresAt) return 0;

  const diff = Math.floor((expiresAt - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
};

const startNewTimer = (email: string, setTimeLeft: (v: number) => void) => {
  const expiresAt = Date.now() + TIMER_DURATION * 1000;

  localStorage.setItem(getStorageKey(email), String(expiresAt));

  setTimeLeft(TIMER_DURATION);
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function EmailVerifyStep({
  form,
  email,
  onNext,
  onPrevious,
}: EmailVerifyStepProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Prevent duplicate OTP sends on strict-mode / re-renders
  const hasSentOtpRef = useRef(false);

  const canResend = timeLeft <= 0;

  const sendOtp = useCallback(async () => {
    console.log("Sending OTP to:", email);
    // await sendOtpAction(email);
  }, [email]);

  const verifyOtp = useCallback(async (otp: string) => {
    console.log("Verifying OTP:", otp);
    // await verifyOtpAction({ email, otp });
  }, []);

  /* ---------------------------------------------
   * Initial mount + email change logic
   * ------------------------------------------- */

  useEffect(() => {
    hasSentOtpRef.current = false;

    const remaining = getRemainingSeconds(email);

    if (remaining > 0) {
      setTimeLeft(remaining);
      return;
    }

    if (!hasSentOtpRef.current) {
      hasSentOtpRef.current = true;

      sendOtp().then(() => {
        startNewTimer(email, setTimeLeft);
      });
    }
  }, [email, sendOtp]);

  /* ---------------------------------------------
   * Countdown timer
   * ------------------------------------------- */

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  /* ---------------------------------------------
   * Actions
   * ------------------------------------------- */

  const handleResend = useCallback(async () => {
    await sendOtp();
    startNewTimer(email, setTimeLeft);
    form.setValue("otp", "");
  }, [email, form, sendOtp]);

  const handleOtpComplete = useCallback(
    async (otp: string) => {
      setIsVerifying(true);

      try {
        await verifyOtp(otp);

        // Cleanup timer after success
        localStorage.removeItem(getStorageKey(email));

        onNext();
      } finally {
        setIsVerifying(false);
      }
    },
    [email, onNext, verifyOtp]
  );

  return (
    <Form {...form}>
      <form className="flex flex-col items-center space-y-6">
        <div className="pb-2 border-b border-gray-light">
          <p className="lg:text-xl text-lg font-bold text-gray-dark">
            قمنا بإرسال رمز التأكيد إلى
            <span className="text-primary-800 font-bold ms-2">{email}</span>
          </p>
        </div>

        <p className="lg:text-xl text-gray-dark">
          هذا الرمز صالح لمدة
          <span className="text-semantics-red font-semibold ms-1">
            {formatTime(timeLeft)}
          </span>
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isVerifying}
          className="text-primary-800 text-sm hover:underline disabled:opacity-50"
        >
          أعد الإرسال
        </button>

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OtpInput
                  length={6}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onComplete={handleOtpComplete}
                  disabled={isVerifying}
                />
              </FormControl>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />

        {isVerifying && (
          <p className="text-sm text-primary-800 animate-pulse">
            جاري التحقق...
          </p>
        )}

        <NavigationButtons
          onPrevious={onPrevious}
          isPending={isVerifying}
          pendingText="جاري التحقق..."
        />
      </form>
    </Form>
  );
}
