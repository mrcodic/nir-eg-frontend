"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { EmailVerifyFormData } from "@/lib/validations/subscribe";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { OtpInput } from "../shared";
import NavigationButtons from "../shared/NavigationButtons";

interface EmailVerifyStepProps {
  form: UseFormReturn<EmailVerifyFormData>;
  email: string;
  onNext: () => void;
  onPrevious: () => void;
}

const TIMER_DURATION = 180; // 3 minutes in seconds

export default function EmailVerifyStep({
  form,
  email,
  onNext,
  onPrevious,
}: EmailVerifyStepProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isVerifying, setIsVerifying] = useState(false);

  // Derive canResend from timeLeft instead of using useEffect
  const canResend = timeLeft <= 0;

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle resend
  const handleResend = useCallback(async () => {
    // TODO: Call API to resend OTP
    console.log("Resending OTP to:", email);
    setTimeLeft(TIMER_DURATION);
    form.setValue("otp", "");
  }, [email, form]);

  // Handle OTP complete
  const handleOtpComplete = useCallback(
    async (otp: string) => {
      setIsVerifying(true);
      // TODO: Call API to verify OTP
      console.log("Verifying OTP:", otp);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsVerifying(false);

      // If valid, proceed to next step
      onNext();
    },
    [onNext]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="flex flex-col items-center space-y-6"
      >
        {/* Instructions */}
        <div className="pb-2 border-b border-gray-light">
          <p className="text-gray-dark lg:text-xl text-lg font-bold">
            قمنا بإرسال رمز التأكيد على البريد الإلكتروني الخاص بك
            <span className="text-primary-800 font-bold ms-2">{email}</span>
          </p>
        </div>

        {/* Timer */}
        <div className="text-center">
          <p className="lg:text-xl text-lg text-gray-dark">
            هذا الرمز صالح لمدة{" "}
            <span className="font-semibold  text-semantics-red ms-1">
              {formatTime(timeLeft)}
            </span>
          </p>
        </div>

        {/* Resend Link */}

        <button
          type="button"
          onClick={handleResend}
          className="text-primary-800 hover:underline text-sm disabled:text-gray-dark/60 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
          disabled={isVerifying || !canResend}
        >
          أعد الإرسال
        </button>

        {/* OTP Input */}
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OtpInput
                  length={6}
                  value={field.value || ""}
                  onChange={field.onChange}
                  onComplete={handleOtpComplete}
                  disabled={isVerifying}
                  className="h-12"
                />
              </FormControl>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />

        {/* Loading State */}
        {isVerifying && (
          <p className="text-sm text-primary-800 animate-pulse">
            جاري التحقق...
          </p>
        )}

        {/* Navigation Buttons */}
        <NavigationButtons onPrevious={onPrevious} />
      </form>
    </Form>
  );
}
