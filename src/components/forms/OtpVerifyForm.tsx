"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import OTPInput from "@/components/custom/OTPInput";
import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import CountDownTimerUI from "@/components/ui/CountDownTimerUI";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OTP_SEND_TIME_KEY } from "@/constants";
import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import useOtp from "@/hooks/useOtp";
import { otpSchema } from "@/lib/schemas";

export type OtpVerifyFormProps = {
  phone: string;
  /** Called after a successful /otp/verify response. Clean up localStorage before calling. */
  onSuccess: () => void | Promise<void>;
  /** Auto-submit when all 6 digits are entered. Default: false. */
  autoSubmit?: boolean;
  /** Label for the submit button. Default: "تأكيد" */
  submitLabel?: string;
  /**
   * Replaces the default submit button row.
   * Receives isSubmitting + isStart so the caller can disable its own buttons.
   */
  footer?: (ctx: {
    isSubmitting: boolean;
    isStart: boolean;
  }) => React.ReactNode;
  onError?: (message: string) => void;
};

export default function OtpVerifyForm({
  phone,
  onSuccess,
  autoSubmit = false,
  submitLabel = "تأكيد",
  footer,
  onError,
}: OtpVerifyFormProps) {
  const { toast } = useToast();
  const { sendOtp, start, minutes, seconds, resending, isExpired } = useOtp();

  const isAutoSubmitting = useRef(false);
  const initialSend = useRef(false);
  const [inlineError, setInlineError] = useState("");

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { phone, otp_code: "" },
  });

  // Keep phone in sync if it changes (e.g. multi-step registration)
  useEffect(() => {
    form.setValue("phone", phone);
    form.setValue("otp_code", "");
    setInlineError("");
  }, [phone, form]);

  // Send OTP on mount when timer is already expired (first open)
  useEffect(() => {
    if (!isExpired && !initialSend.current) {
      initialSend.current = true;
      return;
    }
    if (initialSend.current) return;
    if (isExpired && phone) {
      initialSend.current = true;
      sendOtp(phone);
    }
  }, [isExpired, phone, sendOtp]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof otpSchema>) => {
      try {
        if (!phone) {
          const msg = "رقم الهاتف غير متاح";
          setInlineError(msg);
          onError?.(msg);
          toast({ description: msg, icon: "error" });
          return;
        }

        setInlineError("");
        await mutateClient("/otp/verify", { body: { ...data, phone } });
        localStorage.removeItem(OTP_SEND_TIME_KEY);
        toast({ description: "تم تأكيد رقم الهاتف بنجاح", icon: "success" });
        await onSuccess?.();
      } catch (e: any) {
        const msg = "رمز التأكيد غلط او وقته خلص";
        setInlineError(msg);
        onError?.(msg);
        toast({ description: msg, icon: "error", status: e?.status });
      }
    },
    [phone, onSuccess, onError, toast],
  );

  // Auto-submit when OTP reaches 6 digits
  const otpValue = useWatch({ control: form.control, name: "otp_code" });
  useEffect(() => {
    if (!autoSubmit) return;
    if (otpValue?.length === 6 && !isAutoSubmitting.current) {
      isAutoSubmitting.current = true;
      form.handleSubmit(onSubmit)();
    } else if ((otpValue?.length ?? 0) < 6) {
      isAutoSubmitting.current = false;
    }
  }, [autoSubmit, otpValue, form, onSubmit]);

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Countdown */}
        {start && <CountDownTimerUI minutes={minutes} seconds={seconds} />}

        {/* Resend button */}
        <button
          type="button"
          onClick={() => {
            setInlineError("");
            if (!phone) {
              const msg = "رقم الهاتف غير متاح";
              setInlineError(msg);
              onError?.(msg);
              return;
            }
            sendOtp(phone);
          }}
          disabled={start || resending}
          className="text-secondary mt-4 flex cursor-pointer items-center gap-1 text-base font-bold underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          أعد الإرسال {resending && <SmallSpinner className="size-4" />}
        </button>

        {/* OTP input */}
        <div>
          <FormLabel className="mb-2 block text-xl">أدخل رمز التأكيد</FormLabel>
          {inlineError && (
            <p className="text-sm font-medium text-red-500">{inlineError}</p>
          )}
          <div className="flex justify-end" dir="ltr">
            <FormField
              control={form.control}
              name="otp_code"
              render={() => (
                <FormItem>
                  <FormControl>
                    <OTPInput
                      length={6}
                      form={form}
                      name="otp_code"
                      disabled={!start || isSubmitting}
                    />
                  </FormControl>
                  {start && <FormMessage />}
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Footer — custom or default submit button */}
        {footer ? (
          footer({ isSubmitting, isStart: start })
        ) : (
          <Button
            type="submit"
            className="w-full"
            disabled={!start || isSubmitting}
          >
            {isSubmitting ? (
              <SmallSpinner className="text-white" />
            ) : (
              submitLabel
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
