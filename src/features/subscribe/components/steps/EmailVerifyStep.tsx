"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { axiosInstance } from "@/lib/axios-instance";
import type {
  AccountInfoFormData,
  EmailVerifyFormData,
} from "@/lib/schemas/subscribe.schema";
import {
  getRemainingSeconds,
  OTP_STORAGE_KEY,
  startNewTimer,
} from "@/utils/otp-helpers";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { OtpInput } from "../shared";
import NavigationButtons from "../shared/NavigationButtons";

interface EmailVerifyStepProps {
  form: UseFormReturn<EmailVerifyFormData>;
  accountForm: UseFormReturn<AccountInfoFormData>;
  onNext: () => void;
  onPrevious: () => void;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function EmailVerifyStep({
  form,
  accountForm,
  onNext,
  onPrevious,
}: EmailVerifyStepProps) {
  const [timeLeft, setTimeLeft] = useState(() => getRemainingSeconds());
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const email = accountForm.getValues("email");
  const user_id = accountForm.getValues("user_id");

  // Prevent duplicate OTP sends on strict-mode / re-renders
  // const hasSentOtpRef = useRef(false);

  const canResend = timeLeft <= 0;

  const sendOtp = useCallback(async () => {
    try {
      setIsSending(true);
      console.log("Sending OTP to:", email);

      const res = await axiosInstance.post("/email-otp/send", { user_id });

      setTimeLeft(startNewTimer());

      console.log("OTP sent successfully:", res.data);

      toast.success("OTP sent successfully");
    } catch (e) {
      console.log("Failed to send OTP:", e);
      toast.error("Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  }, [user_id, email]);

  const verifyOtp = useCallback(
    async (otp: string) => {
      return await axiosInstance.post("/email-otp/verify", {
        email,
        user_id,
        code: otp,
      });
    },
    [email, user_id]
  );

  /* ---------------------------------------------
   * Initial mount + email change logic
   * ------------------------------------------- */

  // useEffect(() => {
  //   if (hasSentOtpRef.current || !email) return;

  //   const remaining = getRemainingSeconds();

  //   if (remaining > 0) {
  //     setTimeLeft(remaining);
  //     return;
  //   }

  //   hasSentOtpRef.current = true;
  //   if (!hasSentOtpRef.current) {

  //     sendOtp();
  //   }
  // }, [email, user_id, sendOtp]);

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
    form.setValue("otp", "");
  }, [form, sendOtp]);

  const handleOtpComplete = useCallback(
    async (otp: string) => {
      if (localStorage.getItem("last_verified_email") === email) {
        onNext();
        return;
      }

      setIsVerifying(true);

      try {
        const res = await verifyOtp(otp);

        console.log(res);

        // Cleanup timer after success
        localStorage.removeItem(OTP_STORAGE_KEY);

        accountForm.setValue("email_verified", true);

        localStorage.setItem("last_verified_email", email);
        toast.success("OTP verified successfully");

        onNext();
      } catch (e) {
        console.log("Failed to verify OTP:", e);
        toast.error("Failed to verify OTP");
      } finally {
        setIsVerifying(false);
      }
    },
    [accountForm, email, onNext, verifyOtp]
  );

  return (
    <Form {...form}>
      <form
        key={"email form"}
        onSubmit={(e) => {
          e.preventDefault();
          handleOtpComplete(form.getValues("otp"));
        }}
        className="flex flex-col items-center space-y-6"
        dir="rtl"
      >
        <div className="pb-2 border-b border-gray-light">
          <p className="lg:text-xl text-lg font-bold text-gray-dark">
            قمنا بإرسال رمز التأكيد إلى
            <span className="text-primary-800 font-bold ms-2">{email}</span>
          </p>
        </div>

        {!canResend ? (
          <p className="lg:text-xl text-gray-dark">
            هذا الرمز صالح لمدة
            <span className="text-semantics-red font-semibold ms-1">
              {formatTime(timeLeft)}
            </span>
          </p>
        ) : (
          <p className="lg:text-xl text-gray-dark">يمكنك إعادة الإرسال</p>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isVerifying || isSending}
          className="text-primary-800 text-sm hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed"
        >
          أعد الإرسال{" "}
          {isSending && <Loader2 className=" animate-spin size-4" />}
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
