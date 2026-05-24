"use client";

import { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  buildProfileCompletionSteps,
  ProfileCompletionValues,
} from "@/helpers/profile-completion.helpers";
import { DynamicProfileField } from "@/types/auth.types";

type UseProfileCompletionStepperParams = {
  form: UseFormReturn<ProfileCompletionValues>;
  fields: DynamicProfileField[];
};

export function useProfileCompletionStepper({
  form,
  fields,
}: UseProfileCompletionStepperParams) {
  const [currentStep, setCurrentStep] = useState(0);

  // ── Derived ────────────────────────────────────────────────
  const fieldSteps = useMemo(
    () => buildProfileCompletionSteps(fields),
    [fields],
  );

  const boundedCurrentStep = useMemo(
    () => Math.min(currentStep, Math.max(0, fieldSteps.length - 1)),
    [currentStep, fieldSteps.length],
  );

  const isStepper = fieldSteps.length > 1;
  const isLastStep = boundedCurrentStep === fieldSteps.length - 1;
  const currentStepFields = fieldSteps[boundedCurrentStep] ?? [];

  // ── Navigation ─────────────────────────────────────────────
  const resetStep = () => setCurrentStep(0);

  const goPrevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const goNextStep = async () => {
    if (!isStepper) return;

    const fieldNames = currentStepFields.map(
      (f) => f.key as keyof ProfileCompletionValues,
    );
    const isValid = await form.trigger(fieldNames, { shouldFocus: true });

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, fieldSteps.length - 1));
    }
  };

  const moveToStepByField = (fieldKey?: string) => {
    if (!fieldKey || !isStepper) return;

    const stepIndex = fieldSteps.findIndex((step) =>
      step.some((f) => f.key === fieldKey),
    );
    if (stepIndex >= 0) setCurrentStep(stepIndex);
  };

  const goToStep = async (targetStep: number) => {
    if (!isStepper) return;
    if (targetStep < 0 || targetStep >= fieldSteps.length) return;

    if (targetStep <= boundedCurrentStep) {
      setCurrentStep(targetStep);
      return;
    }

    for (let stepIndex = boundedCurrentStep; stepIndex < targetStep; stepIndex++) {
      const fieldNames = (fieldSteps[stepIndex] ?? []).map(
        (f) => f.key as keyof ProfileCompletionValues,
      );
      const isValid = await form.trigger(fieldNames, { shouldFocus: true });
      if (!isValid) {
        setCurrentStep(stepIndex);
        return;
      }
    }

    setCurrentStep(targetStep);
  };

  return {
    // State
    currentStep,
    boundedCurrentStep,
    setCurrentStep,
    // Flags
    isStepper,
    isLastStep,
    // Data
    fieldSteps,
    currentStepFields,
    // Actions
    resetStep,
    goNextStep,
    goPrevStep,
    moveToStepByField,
    goToStep,
  };
}
