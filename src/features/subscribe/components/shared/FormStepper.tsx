"use client";

import { cn } from "@/lib/utils";
import type { FormStep, StepId } from "@/types/subscribe";
import { Check, LoaderCircle } from "lucide-react";
import { memo } from "react";

interface FormStepperProps {
  steps: FormStep[];
  currentStep: StepId;
  completedSteps: StepId[];
  setCurrentStepIndex: (index: number) => void;
}

function FormStepper({
  steps,
  currentStep,
  completedSteps,
  setCurrentStepIndex,
}: FormStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-start justify-center w-full" dir="rtl">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = step.id === currentStep;
        const isLast = index === steps.length - 1;
        const emailVerifiedStep = step.id === "verify";

        return (
          <button
            key={step.id}
            className="flex items-center"
            onClick={() =>
              setCurrentStepIndex(
                emailVerifiedStep && isCompleted ? index + 1 : index
              )
            }
            disabled={
              index !== 0 &&
              !isCompleted &&
              !completedSteps.includes(steps?.[index - 1]?.id)
            }
          >
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "size-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  isCurrent
                    ? "bg-primary-800 text-white  border-2 border-primary-100 "
                    : isCompleted
                    ? "bg-primary-800 text-white"
                    : "bg-gray-light text-gray-dark opacity-30"
                )}
              >
                {isCurrent ? (
                  <LoaderCircle className="size-6 animate-spin" />
                ) : isCompleted ? (
                  <Check className="size-6" />
                ) : (
                  <LoaderCircle className="size-6 " />
                )}
              </div>

              {/* Step Title */}
              <span
                className={cn(
                  "mt-2 sm:text-xs text-10 text-center max-w-20",
                  isCurrent || isCompleted
                    ? "text-primary-800 font-medium"
                    : "text-gray-dark opacity-50"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div
                className={cn(
                  "sm:w-12 w-full h-0.5 mx-1.5 transition-all duration-300 self-start mt-10",
                  index < currentIndex ? "bg-primary-800" : "bg-gray-light"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default memo(FormStepper);
