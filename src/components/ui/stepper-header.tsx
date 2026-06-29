"use client";

import { cn } from "@/lib/utils";

type StepperHeaderProps = {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
};

export default function StepperHeader({
  currentStep,
  totalSteps,
  onStepClick,
  className,
}: StepperHeaderProps) {
  const steps = Array.from({ length: totalSteps }, (_, idx) => idx);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        { "mx-auto w-full max-w-md": steps.length === 2 },
        className,
      )}
    >
      {steps.map((stepIndex, idx) => {
        const stepNumber = stepIndex + 1;
        const isDoneOrCurrent = stepIndex <= currentStep;

        return (
          <div
            key={stepIndex}
            className={cn("flex items-center gap-2", {
              "flex-1": idx !== steps.length - 1,
            })}
          >
            <button
              type="button"
              onClick={() => onStepClick?.(stepIndex)}
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full text-lg font-bold transition-colors",
                isDoneOrCurrent
                  ? "bg-primary-800 text-white"
                  : "bg-gray-light text-gray-dark",
              )}
              aria-label={`Go to step ${stepNumber}`}
            >
              {stepNumber}

              {idx === currentStep && (
                <div className="bg-primary-800 absolute top-1.5 left-1.5 -z-1 size-7 animate-ping rounded-full" />
              )}
            </button>

            {idx !== steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1",
                  stepIndex < currentStep ? "bg-primary-800" : "bg-gray-light",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
