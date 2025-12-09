"use client";

import { cn } from "@/lib/utils";
import type { FormStep, StepId } from "@/types/subscribe";
import { Check, LoaderCircle } from "lucide-react";
import { memo } from "react";

interface FormStepperProps {
  steps: FormStep[];
  currentStep: StepId;
  completedSteps: StepId[];
}

function FormStepper({ steps, currentStep, completedSteps }: FormStepperProps) {
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
                  "sm:size-12 size-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  isCompleted
                    ? "bg-primary-800 text-white"
                    : isCurrent
                    ? "bg-primary-800 text-white sm:size-13 size-9  border-2 border-primary-100 -mt-px"
                    : "bg-gray-light text-gray-dark"
                )}
              >
                {isCompleted ? (
                  <Check className="sm:size-6 size-3" />
                ) : isCurrent ? (
                  <LoaderCircle className="sm:size-6 size-3 animate-spin" />
                ) : (
                  <LoaderCircle className="sm:size-6 size-3 opacity-60" />
                )}
              </div>

              {/* Step Title */}
              <span
                className={cn(
                  "mt-2 sm:text-xs text-10 text-center max-w-20",
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
                  "sm:w-12 w-full h-0.5 mx-2 transition-all duration-300 self-start sm:mt-10 mt-8",
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

export default memo(FormStepper);
