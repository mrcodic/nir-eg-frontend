"use client";

import { cn } from "@/lib/utils";
import type { FormStep, StepId } from "@/types/subscribe";
import { Check, LoaderCircle } from "lucide-react";

interface FormStepperProps {
  steps: FormStep[];
  currentStep: StepId;
  completedSteps: StepId[];
}

// Step icons mapping
const stepIcons: Record<StepId, React.ReactNode> = {
  account: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  verify: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  business: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect x="6" y="10" width="12" height="10" rx="1" />
    </svg>
  ),
  branding: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  payment: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
};

export default function FormStepper({
  steps,
  currentStep,
  completedSteps,
}: FormStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-start justify-center w-full" dir="rtl">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = step.id === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "size-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  isCompleted
                    ? "bg-primary-800 text-white"
                    : isCurrent
                    ? "bg-primary-800 text-white  border-2 border-primary-100"
                    : "bg-gray-light text-gray-dark"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                  stepIcons[step.id]
                )}
              </div>

              {/* Step Title */}
              <span
                className={cn(
                  "mt-2 text-xs text-center max-w-20",
                  isCurrent || isCompleted
                    ? "text-primary-800 font-medium"
                    : "text-gray-dark"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-2 transition-all duration-300 self-start mt-10",
                  index < currentIndex ? "bg-primary-800" : "bg-gray-light"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
