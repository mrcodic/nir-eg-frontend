"use client";

import StyledText from "@/components/ui/StyledText";
import type { FormVariant, PaymentPeriod } from "@/types/subscribe.types";
import { useSubscribeForm } from "../hooks";
import { FormSidebar, FormStepper } from "./shared";
import StepRenderer from "./StepRenderer";

interface SubscribeFormProps {
  variant: FormVariant;
  planId?: string;
  period: PaymentPeriod;
}

export default function SubscribeForm({
  variant,
  planId,
  period,
}: SubscribeFormProps) {
  const {
    steps,
    currentStep,
    setCurrentStepIndex,
    completedSteps,
    emailVerified,
    isSubmitting,
    forms,
    handlers,
  } = useSubscribeForm({ variant, planId, period });

  return (
    <div className="flex flex-row-reverse wrapper my-16 md:my-22 gap-10">
      {/* Sidebar - Fixed on desktop */}
      <aside className="hidden lg:block">
        <FormSidebar variant={variant} planId={planId} period={period} />
      </aside>

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
              emailVerified={emailVerified}
            />
          </div>

          {/* Form Content */}
          <div className="max-w-3xl mx-auto w-full ">
            <StepRenderer
              currentStepId={currentStep.id}
              variant={variant}
              planId={planId}
              isSubmitting={isSubmitting}
              forms={forms}
              handlers={handlers}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
