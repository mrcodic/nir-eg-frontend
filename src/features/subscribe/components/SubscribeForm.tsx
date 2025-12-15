"use client";

import StyledText from "@/components/ui/StyledText";
import type {
  FormStep,
  FormVariant,
  PaidTier,
  PaymentPeriod,
  StepId,
} from "@/types/subscribe.types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import useStepsForms from "../hooks/useStepsForms";
import { FormSidebar, FormStepper } from "./shared";
import {
  AccountInfoStep,
  BrandingStep,
  BusinessInfoStep,
  EmailVerifyStep,
  PaymentStep,
} from "./steps";

interface SubscribeFormProps {
  variant: FormVariant;
  tier?: PaidTier;
  period: PaymentPeriod;
}

// Step configuration
const getSteps = (variant: FormVariant): FormStep[] => {
  const baseSteps: FormStep[] = [
    { id: "account", title: "معلومات الحساب" },
    { id: "verify", title: "تأكيد البريد الإلكتروني" },
    { id: "business", title: "تفاصيل العمل التجاري" },
    { id: "branding", title: "الموقع والعلامة التجارية" },
  ];

  if (variant === "paid") {
    baseSteps.push({ id: "payment", title: "الدفع والاشتراك" });
  }

  return baseSteps;
};

export default function SubscribeForm({
  variant,
  tier = "pro",
  period,
}: SubscribeFormProps) {
  const router = useRouter();
  const steps = useMemo(() => getSteps(variant), [variant]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[currentStepIndex];

  // Form instances for each step
  const { accountForm, verifyForm, businessForm, brandingForm, paymentForm } =
    useStepsForms({ period });

  const emailVerified = useMemo(
    () =>
      verifyForm.getValues("otp") !== "" && completedSteps.includes("verify"),
    [completedSteps, verifyForm]
  );

  // Navigation handlers
  const handleNext = useCallback(async () => {
    // Mark current step as completed
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep.id)) {
        return [...prev, currentStep.id];
      }
      return prev;
    });

    // Move to next step
    // step over email verification if completed
    if (currentStepIndex < steps.length - 1) {
      const nextStepId = steps[currentStepIndex + 1].id;
      if (nextStepId === "verify" && emailVerified) {
        setCurrentStepIndex((prev) => prev + 2);
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    }
  }, [currentStep, currentStepIndex, emailVerified, steps]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      const previousStepId = steps[currentStepIndex - 1].id;
      if (previousStepId === "verify" && emailVerified) {
        setCurrentStepIndex((prev) => prev - 2);
      } else {
        setCurrentStepIndex((prev) => prev - 1);
      }
    }
  }, [currentStepIndex, emailVerified, steps]);

  const resetEmailVerificationForm = useCallback(() => {
    verifyForm.reset();
    setCompletedSteps((prev) => prev.filter((step) => step !== "verify"));
  }, [verifyForm]);

  // Final submission
  const handleFinalSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Collect all form data
      const formData = {
        account: accountForm.getValues(),
        verify: verifyForm.getValues(),
        business: businessForm.getValues(),
        branding: brandingForm.getValues(),
        ...(variant === "paid" && { payment: paymentForm.getValues() }),
      };

      console.log("Submitting form data:", formData);

      // TODO: Call API to submit registration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success - redirect or show success message
      toast.success("تم الاشتراك بنجاح! 🎉");
      // alert("تم الاشتراك بنجاح! 🎉");
      router.push("/subscribe/building?timestamp=" + Date.now());
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    accountForm,
    verifyForm,
    businessForm,
    brandingForm,
    paymentForm,
    variant,
    router,
  ]);

  // Render current step
  const renderStep = () => {
    switch (currentStep.id) {
      case "account":
        return (
          <AccountInfoStep
            form={accountForm}
            onNext={handleNext}
            resetEmailVerificationForm={resetEmailVerificationForm}
          />
        );
      case "verify":
        return (
          <EmailVerifyStep
            form={verifyForm}
            email={accountForm.getValues("email")}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "business":
        return (
          <BusinessInfoStep
            form={businessForm}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "branding":
        return (
          <BrandingStep
            form={brandingForm}
            onNext={variant === "demo" ? handleFinalSubmit : handleNext}
            onPrevious={handlePrevious}
            isLastStep={variant === "demo"}
            isSubmitting={isSubmitting}
          />
        );
      case "payment":
        return (
          <PaymentStep
            form={paymentForm}
            tier={tier}
            onSubmit={handleFinalSubmit}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row-reverse wrapper my-16 md:my-22 gap-10">
      {/* Sidebar - Fixed on desktop */}
      <FormSidebar variant={variant} tier={tier} />

      {/* Main Content - Scrollable */}
      <main className="flex-1 flex flex-col lg:min-h-0 shrink-0">
        {/* Scrollable Content Area */}
        <div className="flex-1 ">
          {/* Header */}
          <div className="text-start mb-12">
            <h1 className="lg:text-32 text-2xl font-bold">
              املأ <StyledText text="النموذج" /> التالي
            </h1>
            <p className="text-gray-dark mt-2 lg:text-xl text-sm font-bold">
              {variant === "demo"
                ? "املأ النموذج لتحصل على نسختك التجريبية"
                : "املأ النموذج لتحصل على موقعك الإلكتروني"}
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-12 overflow-x-auto pb-2">
            <FormStepper
              steps={steps}
              currentStep={currentStep.id}
              setCurrentStepIndex={setCurrentStepIndex}
              completedSteps={completedSteps}
            />
          </div>

          {/* Form Content */}
          <div className="max-w-3xl mx-auto w-full ">{renderStep()}</div>
        </div>
      </main>
    </div>
  );
}
