import { FormVariant } from "@/types/subscribe.types";
import { useSubscribeForm } from "../hooks";
import {
  AccountInfoStep,
  BrandingStep,
  BusinessInfoStep,
  EmailVerifyStep,
  PaymentStep,
} from "./steps";

type UseSubscribeForm = ReturnType<typeof useSubscribeForm>;

interface StepRendererProps {
  currentStepId: string;
  variant: FormVariant;
  planId?: string;
  isSubmitting: boolean;
  forms: UseSubscribeForm["forms"];
  handlers: UseSubscribeForm["handlers"];
}

export default function StepRenderer({
  currentStepId,
  variant,
  planId,
  isSubmitting,
  forms,
  handlers,
}: StepRendererProps) {
  const { accountForm, verifyForm, businessForm, brandingForm, paymentForm } =
    forms;
  const {
    handleNext,
    handlePrevious,
    handleFinalSubmit,
    resetEmailVerificationForm,
  } = handlers;

  switch (currentStepId) {
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
          accountForm={accountForm}
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
          planId={planId}
          onSubmit={handleFinalSubmit}
          onPrevious={handlePrevious}
          isSubmitting={isSubmitting}
        />
      );
    default:
      return null;
  }
}
