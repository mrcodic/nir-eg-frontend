"use client";

import type { FormVariant, StepId } from "@/types/subscribe.types";
import { useCallback, useState } from "react";

const STORAGE_KEY = "nir-subscribe-form";

interface FormPersistenceData {
  currentStepIndex: number;
  completedSteps: StepId[];
  variant: FormVariant;
  lastUpdated: number;
}

interface UseFormNavigationOptions {
  totalSteps: number;
  variant: FormVariant;
  enablePersistence?: boolean;
}

interface UseFormNavigationReturn {
  currentStepIndex: number;
  completedSteps: StepId[];
  isTransitioning: boolean;
  goToNextStep: (currentStepId: StepId) => void;
  goToPreviousStep: () => void;
  goToStep: (index: number) => void;
  resetForm: () => void;
}

/**
 * Helper to get persisted state from localStorage
 */
function getPersistedState(
  variant: FormVariant,
  enablePersistence: boolean
): { stepIndex: number; completed: StepId[] } | null {
  if (!enablePersistence || typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: FormPersistenceData = JSON.parse(stored);
      const isValid =
        data.variant === variant &&
        Date.now() - data.lastUpdated < 24 * 60 * 60 * 1000;

      if (isValid) {
        return {
          stepIndex: data.currentStepIndex,
          completed: data.completedSteps,
        };
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return null;
}

/**
 * Custom hook for managing multi-step form navigation
 * with optional localStorage persistence
 */
export function useFormNavigation({
  totalSteps,
  variant,
  enablePersistence = false,
}: UseFormNavigationOptions): UseFormNavigationReturn {
  // Use lazy initializers to load from localStorage
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const persisted = getPersistedState(variant, enablePersistence);
    return persisted?.stepIndex ?? 0;
  });

  const [completedSteps, setCompletedSteps] = useState<StepId[]>(() => {
    const persisted = getPersistedState(variant, enablePersistence);
    return persisted?.completed ?? [];
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Save state to localStorage
  const persistState = useCallback(
    (stepIndex: number, completed: StepId[]) => {
      if (!enablePersistence) return;

      try {
        const data: FormPersistenceData = {
          currentStepIndex: stepIndex,
          completedSteps: completed,
          variant,
          lastUpdated: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Ignore localStorage errors
      }
    },
    [enablePersistence, variant]
  );

  const goToNextStep = useCallback(
    (currentStepId: StepId) => {
      if (currentStepIndex >= totalSteps - 1) return;

      setIsTransitioning(true);

      // Mark current step as completed
      setCompletedSteps((prev) => {
        const newCompleted = prev.includes(currentStepId)
          ? prev
          : [...prev, currentStepId];
        return newCompleted;
      });

      // Small delay for transition effect
      setTimeout(() => {
        setCurrentStepIndex((prev) => {
          const newIndex = prev + 1;
          // Persist after state update
          setCompletedSteps((completed) => {
            if (!completed.includes(currentStepId)) {
              const newCompleted = [...completed, currentStepId];
              persistState(newIndex, newCompleted);
              return newCompleted;
            }
            persistState(newIndex, completed);
            return completed;
          });
          return newIndex;
        });
        setIsTransitioning(false);
      }, 150);
    },
    [currentStepIndex, totalSteps, persistState]
  );

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex <= 0) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentStepIndex((prev) => {
        const newIndex = prev - 1;
        persistState(newIndex, completedSteps);
        return newIndex;
      });
      setIsTransitioning(false);
    }, 150);
  }, [currentStepIndex, completedSteps, persistState]);

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSteps) return;

      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentStepIndex(index);
        persistState(index, completedSteps);
        setIsTransitioning(false);
      }, 150);
    },
    [totalSteps, completedSteps, persistState]
  );

  const resetForm = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);

    if (enablePersistence) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  }, [enablePersistence]);

  return {
    currentStepIndex,
    completedSteps,
    isTransitioning,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetForm,
  };
}
