"use client";

import { cn } from "@/lib/utils";
import type { FormStep, StepId } from "@/types/subscribe.types";
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
            className="flex items-center "
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
                  "size-12 cursor-pointer disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  isCurrent
                    ? "bg-gray-dark text-white  border-2 border-primary-800 "
                    : isCompleted
                    ? emailVerifiedStep
                      ? "bg-semantics-green-dark opacity-80 text-white  border-2 border-semantics-green-dark cursor-auto"
                      : "bg-dark-radial text-white"
                    : "bg-gray-light text-gray-dark opacity-30 cursor-auto"
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
                  isCurrent
                    ? "text-black font-bold"
                    : isCompleted
                    ? "text-dark-radial font-bold"
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
                  index < currentIndex ? "bg-dark-radial" : "bg-gray-light"
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
