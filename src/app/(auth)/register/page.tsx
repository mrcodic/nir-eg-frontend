"use client";

import SmallSpinner from "@/components/custom/SmallSpinner";
import OtpVerifyForm from "@/components/forms/OtpVerifyForm";
import RegisterStepOne from "@/components/forms/register-stepper/RegisterStepOne";
import RegisterStepperHeader from "@/components/forms/register-stepper/RegisterStepperHeader";
import RegisterStepTwo from "@/components/forms/register-stepper/RegisterStepTwo";
import { useRegisterStepper } from "@/components/forms/register-stepper/useRegisterStepper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuthContext } from "@/context/auth-context";
import { useTenant } from "@/context/TenantProvider";
import { useToast } from "@/hooks/use-toast";
import { registerSchema } from "@/lib/schemas";
import { RegisterFormValues, RegisterStep } from "@/types/register.types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { features } = useTenant();
  const { profile } = useAuthContext();

  const [step, setStep] = useState<RegisterStep>(1);
  const [phoneForOtp, setPhoneForOtp] = useState("");

  const form = useForm<RegisterFormValues>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phones: {
        country: "+20",
        country_iso: "EG",
        phone: "",
        parent__phone: "",
      },
      password: "",
      password_confirmation: "",
      grade_id: "",
      type: "4",
      state_id: 0,
      city_id: 0,
      recaptcha_token: "",
    },
  });

  if (profile) {
    redirect("/");
  }

  const { validateStepOne, submitRegister } = useRegisterStepper({
    form,
    setStep,
    onErrorToast: (message) =>
      toast({
        description: message,
        icon: "error",
      }),
    onRegistered: (phone) => {
      setPhoneForOtp(phone);
      setStep(3);
      toast({
        description: "تم إنشاء الحساب، قم بتأكيد كود التفعيل",
        icon: "success",
      });
    },
  });

  return (
    <>
      <RegisterStepperHeader
        step={step}
        isOtpStep={step === 3}
        phoneLabel={phoneForOtp}
      />

      <Form {...form}>
        <form className="mt-10 w-full space-y-8">
          {step === 1 && <RegisterStepOne form={form} />}
          {step === 2 && (
            <RegisterStepTwo
              form={form}
              showCenterOption={Boolean(features?.center_system)}
            />
          )}
          {step === 3 && (
            <OtpVerifyForm
              phone={phoneForOtp || form.getValues("phones.phone")}
              onSuccess={() => {
                router.push("/login");
              }}
            />
          )}

          {step !== 3 && (
            <>
              {step === 2 && (
                <GoogleReCaptcha
                  onVerify={(token) => {
                    form.setValue("recaptcha_token", token);
                  }}
                />
              )}

              <div className="flex gap-2">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-1/3"
                    onClick={() => setStep(1)}
                  >
                    السابق
                  </Button>
                )}

                {step === 1 ? (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={async () => {
                      const valid = await validateStepOne();
                      if (valid) setStep(2);
                    }}
                  >
                    التالي
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="flex-1"
                    disabled={form.formState.isSubmitting}
                    onClick={async () => {
                      await submitRegister();
                    }}
                  >
                    {!form.formState.isSubmitting ? (
                      "تأكيد"
                    ) : (
                      <SmallSpinner className="text-white" />
                    )}
                  </Button>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex justify-center gap-2">
            <span className="text-gray-dark inline-block font-medium">
              لديك حساب بالفعل؟
            </span>
            <Link
              href="/login"
              className="text-primary-800 font-bold underline"
            >
              تسجيل دخول
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};

export default RegisterPage;
