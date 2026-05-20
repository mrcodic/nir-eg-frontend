"use client";

import AuthHeader from "@/layouts/AuthHeader";
import { cn } from "@/lib/utils";
import { RegisterStep } from "../../../types/register.types";

type Props = {
  step: RegisterStep;
  isOtpStep?: boolean;
  phoneLabel?: string;
};

const steps: RegisterStep[] = [1, 2, 3];

export default function RegisterStepperHeader({
  step,
  isOtpStep = false,
  phoneLabel,
}: Props) {
  return (
    <>
      <AuthHeader
        title={isOtpStep ? "كود التفعيل" : "إنشاء حساب جديد"}
        description={
          isOtpStep ? (
            <span>
              قم بإرسال كود التفعيل إلى رقم الهاتف التالي{" "}
              <span className="text-primary-800 font-bold underline" dir="ltr">
                {phoneLabel}
              </span>
            </span>
          ) : (
            "أدخل بياناتك لتتمكن من التسجيل معنا"
          )
        }
      />

      <div className="bg-gray-light mt-2 h-px w-full" />

      <div className="mt-6 mb-8 flex items-center gap-2">
        {steps.map((s, idx) => {
          const isDoneOrCurrent = s <= step;
          return (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-base font-bold",
                  isDoneOrCurrent
                    ? "bg-primary-800 text-white"
                    : "bg-gray-light text-gray-dark",
                )}
              >
                {s}
              </div>
              {idx !== steps.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1",
                    s < step ? "bg-primary-800" : "bg-gray-light",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
