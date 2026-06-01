"use client";

import StepperHeader from "@/components/ui/stepper-header";
import AuthHeader from "@/layouts/AuthHeader";
import { RegisterStep } from "@/types/register.types";

type Props = {
  step: RegisterStep;
  isOtpStep?: boolean;
  phoneLabel?: string;
};

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

      <StepperHeader className="my-12" currentStep={step - 1} totalSteps={3} />
    </>
  );
}
