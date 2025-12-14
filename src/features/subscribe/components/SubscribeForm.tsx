"use client";

import StyledText from "@/components/ui/StyledText";
import {
  accountInfoSchema,
  brandingSchema,
  businessInfoSchema,
  emailVerifySchema,
  paymentSchema,
  type AccountInfoFormData,
  type BrandingFormData,
  type BusinessInfoFormData,
  type EmailVerifyFormData,
  type PaymentFormData,
} from "@/lib/validations/subscribe";
import type {
  FormStep,
  FormVariant,
  PaidTier,
  StepId,
} from "@/types/subscribe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
}: SubscribeFormProps) {
  const router = useRouter();
  const steps = useMemo(() => getSteps(variant), [variant]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[currentStepIndex];

  // Form instances for each step
  const accountForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      language: "ar",
      timezone: "Africa/Cairo",
      acceptTerms: false,
      acceptPrivacy: false,
      acceptSms: false,
      acceptWhatsapp: false,
    },
  });

  const verifyForm = useForm<EmailVerifyFormData>({
    resolver: zodResolver(emailVerifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const businessForm = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      teacherType: "individual",
      brandName: "",
      legalName: "",
      subjects: [],
      gradeLevels: [],
      teachingMethod: "hybrid",
      expectedStudents: 20,
      country: "egypt",
      governorate: "",
      city: "",
      address: "",
      howDidYouHear: "",
      additionalNotes: "",
      discountCode: "",
    },
  });

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      domainType: "sub-domain",
      websiteName: "",
      selectedTemplate: "",
      logoFile: null,
      faviconFile: null,
      coverFile: null,
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentPeriod: "yearly",
      paymentMethod: "e-wallet",
    },
  });

  // Navigation handlers
  const handleNext = useCallback(() => {
    console.log("handleNext", currentStep.title, currentStepIndex);
    // Mark current step as completed
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep.id)) {
        return [...prev, currentStep.id];
      }
      return prev;
    });

    // Move to next step
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      // const currentIndex = steps.findIndex(
      //   (step) => step.id === currentStep.id
      // );
      // setCurrentStepIndex(currentIndex + 1);
    }
  }, [currentStep.id, currentStep.title, currentStepIndex, steps]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

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
        return <AccountInfoStep form={accountForm} onNext={handleNext} />;
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
    <div className="flex flex-row-reverse wrapper my-22 gap-10">
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
            <p className="text-gray-dark mt-2 lg:text-xl text-sm">
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
              completedSteps={completedSteps}
            />
          </div>

          {/* Form Content */}
          <div className="max-w-2xl mx-auto w-full ">{renderStep()}</div>
        </div>
      </main>
    </div>
  );
}
