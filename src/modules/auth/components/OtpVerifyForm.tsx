"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import OTPInput from "@/components/custom/OTPInput";
import SmallSpinner from "@/components/custom/SmallSpinner";
import SuccessFeedbackModal from "@/components/modals/SuccessFeedbackModal";
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
import { useToast } from "@/hooks/use-toast";
import { useMounted } from "@/hooks/useMounted";
import { getOtpErrorMessage } from "@/lib/handle-otp-error";
import { otpSchema } from "@/lib/schemas";
import useOtp from "@/modules/auth/hooks/useOtp";
import { verifyAuthOtpCode } from "@/services/auth.service";
import { OtpSendResponse } from "@/types/auth.types";

export type OtpVerifyFormProps = {
  phone: string;
  onSuccess: () => void | Promise<void>;
  autoSubmit?: boolean;
  submitLabel?: string;
  footer?: (ctx: {
    isSubmitting: boolean;
    isStart: boolean;
  }) => React.ReactNode;
  onError?: (message: string) => void;
  onOtpSent?: (meta: {
    isNew: boolean | null;
    response: OtpSendResponse | null;
  }) => void;
};

export default function OtpVerifyForm({
  phone,
  onSuccess,
  autoSubmit = false,
  submitLabel = "تأكيد",
  footer,
  onError,
  onOtpSent,
}: OtpVerifyFormProps) {
  const { toast } = useToast();
  const { sendOtp, start, minutes, seconds, resending, isExpired } = useOtp();

  const isAutoSubmitting = useRef(false);
  const initialSend = useRef(false);
  const [inlineError, setInlineError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingSuccessAction, setPendingSuccessAction] = useState(false);

  const isMounted = useMounted();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { phone, otp_code: "" },
  });

  useEffect(() => {
    form.setValue("phone", phone);
    form.setValue("otp_code", "");
  }, [phone, form]);

  useEffect(() => {
    const triggerInitialOtp = async () => {
      const response = await sendOtp(phone);
      const isNew = response?.data?.is_new ?? response?.is_new ?? null;
      onOtpSent?.({ isNew, response });
    };

    if (!isExpired && !initialSend.current) {
      initialSend.current = true;
      return;
    }
    if (initialSend.current) return;
    if (isExpired && phone) {
      initialSend.current = true;
      void triggerInitialOtp();
    }
  }, [isExpired, phone, sendOtp, onOtpSent]);

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

        await verifyAuthOtpCode({ phone, otp_code: data.otp_code ?? "" });

        localStorage.removeItem(OTP_SEND_TIME_KEY);
        setPendingSuccessAction(true);
        setShowSuccessModal(true);
      } catch (e: unknown) {
        const msg = getOtpErrorMessage(e);
        setInlineError(msg);
        onError?.(msg);
        toast({ description: msg, icon: "error" });
      }
    },
    [phone, onError, toast],
  );

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

  const handleSuccessModalChange = useCallback(
    async (open: boolean) => {
      setShowSuccessModal(open);
      if (!open && pendingSuccessAction) {
        setPendingSuccessAction(false);
        await onSuccess?.();
      }
    },
    [onSuccess, pendingSuccessAction],
  );

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <FormLabel className="mb-2 block text-lg sm:text-xl">
              {isMounted && start
                ? "أدخل رمز التأكيد"
                : "قم بارسال رمز التاكيد"}
            </FormLabel>

            {inlineError && (
              <p className="my-2 text-sm font-medium text-red-500">
                {inlineError}
              </p>
            )}

            <div className="flex justify-center" dir="ltr">
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {start && <FormMessage />}
                  </FormItem>
                )}
              />
            </div>
          </div>

          {isMounted && start && (
            <CountDownTimerUI minutes={minutes} seconds={seconds} />
          )}

          <button
            type="button"
            onClick={async () => {
              setInlineError("");
              if (!phone) {
                const msg = "رقم الهاتف غير متاح";
                setInlineError(msg);
                onError?.(msg);
                return;
              }
              const response = await sendOtp(phone);
              const isNew = response?.data?.is_new ?? response?.is_new ?? null;
              onOtpSent?.({ isNew, response });
            }}
            disabled={!isMounted || start || resending}
            className="text-secondary mx-auto mt-4 flex cursor-pointer items-center gap-1 text-center text-base font-bold underline disabled:cursor-not-allowed disabled:opacity-40"
          >
            أعد الإرسال {resending && <SmallSpinner className="size-4" />}
          </button>

          {footer ? (
            footer({ isSubmitting, isStart: start })
          ) : (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <SmallSpinner className="text-white" />
              ) : (
                submitLabel
              )}
            </Button>
          )}
        </form>
      </Form>

      <SuccessFeedbackModal
        open={showSuccessModal}
        onOpenChange={(open) => {
          void handleSuccessModalChange(open);
        }}
        message="تم التحقق من رقم جوالك بنجاح"
      />
    </>
  );
}
