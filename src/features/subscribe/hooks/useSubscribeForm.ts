import { axiosInstance } from "@/lib/axios-instance";
import {
  FormStep,
  FormVariant,
  PaymentPeriod,
  StepId,
} from "@/types/subscribe.types";
import { OTP_STORAGE_KEY } from "@/utils/otp-helpers";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useStepsForms, {
  brandingDefaults,
  businessDefaults,
} from "./useStepsForms";
import { accountDefaults } from "./useStepsForms";

// Step configuration
export const getSteps = (variant: FormVariant): FormStep[] => {
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

interface UseSubscribeFormProps {
  variant: FormVariant;
  planId?: string;
  period: PaymentPeriod;
}

export function useSubscribeForm({
  variant,
  planId,
  period,
}: UseSubscribeFormProps) {
  const router = useRouter();
  const steps = useMemo(() => getSteps(variant), [variant]);
  const initCurrentStepRef = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = useMemo(
    () => steps[currentStepIndex],
    [steps, currentStepIndex],
  );

  // Form instances for each step
  const {
    accountForm,
    businessForm,
    brandingForm,
    paymentForm,
    completedSteps,
    setCompletedSteps,
  } = useStepsForms({ period, planId });

  const emailVerified = useMemo(
    () =>
      accountForm.getValues("email_verified") ||
      completedSteps.includes("verify"),
    [accountForm, completedSteps],
  );

  useEffect(() => {
    if (initCurrentStepRef.current) return;
    initCurrentStepRef.current = true;

    const storedCompletedSteps = localStorage.getItem("completedSteps");
    const accountFormStr = localStorage.getItem("accountForm");

    try {
      const parsedAccountForm = accountFormStr
        ? JSON.parse(accountFormStr)
        : {};

      if (!parsedAccountForm?.email_verified) {
        setCurrentStepIndex(0);
        // setCurrentStepIndex(!parsedAccountForm?.user_id ? 0 : 1);
        return;
      }

      const parsedCompletedSteps = storedCompletedSteps
        ? JSON.parse(storedCompletedSteps)
        : [];

      const lastCompletedStep =
        parsedCompletedSteps[parsedCompletedSteps.length - 1] || null;

      if (!lastCompletedStep) {
        setCurrentStepIndex(0);
        return;
      }

      // Find the index of the last completed step
      const lastCompletedStepIndex = steps.findIndex(
        (step) => step?.id === lastCompletedStep,
      );

      // If last completed step is "verify", move to the next step
      if (lastCompletedStep === "verify") {
        const nextStepIndex = lastCompletedStepIndex + 1;
        setCurrentStepIndex(
          nextStepIndex < steps.length ? nextStepIndex : lastCompletedStepIndex,
        );
      } else {
        // Otherwise, stay on the last completed step
        setCurrentStepIndex(
          lastCompletedStepIndex !== -1 ? lastCompletedStepIndex : 0,
        );
      }
    } catch (_e) {
      console.error(_e);
      setCurrentStepIndex(0);
    }
  }, [steps, emailVerified]);

  // Navigation handlers
  const handleNext = useCallback(async () => {
    // Mark current step as completed and maintain order
    setCompletedSteps((prev: StepId[]) => {
      // Create a set of completed step IDs for quick lookup
      const completedSet = new Set(prev);

      // Add current step if not already completed
      if (!completedSet.has(currentStep?.id)) {
        completedSet.add(currentStep?.id);
      }

      // Return steps in the same order as they appear in the steps array
      return steps
        .map((step) => step?.id)
        .filter((stepId) => completedSet.has(stepId));
    });

    // Move to next step
    // step over email verification if completed
    if (currentStepIndex < steps.length - 1) {
      const nextStepId = steps[currentStepIndex + 1]?.id;
      if (nextStepId === "verify" && emailVerified) {
        setCurrentStepIndex((prev) => prev + 2);
        // mark verify as completed
        setCompletedSteps((prev: StepId[]) => {
          const completedSet = new Set(prev);
          if (!completedSet.has("verify")) {
            completedSet.add("verify");
          }
          return steps
            .map((step) => step?.id)
            .filter((stepId) => completedSet.has(stepId));
        });
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [
    currentStep?.id,
    currentStepIndex,
    emailVerified,
    setCompletedSteps,
    steps,
  ]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      const previousStepId = steps[currentStepIndex - 1]?.id;
      if (previousStepId === "verify" && emailVerified) {
        setCurrentStepIndex((prev) => prev - 2);
      } else {
        setCurrentStepIndex((prev) => prev - 1);
      }
    }
  }, [currentStepIndex, emailVerified, steps]);

  const resetEmailVerificationForm = useCallback(() => {
    accountForm.setValue("email_verified", false);
    accountForm.setValue("user_id", undefined);
    setCompletedSteps((prev: StepId[]) =>
      prev.filter((step) => step !== "verify"),
    );
    localStorage.removeItem(OTP_STORAGE_KEY);
  }, [accountForm, setCompletedSteps]);

  // check all forms using form.trigger before final submit and change current index to the first form that has errors
  const checkFormsForErrors = useCallback(async () => {
    const forms = [accountForm, businessForm, brandingForm];
    if (variant === "paid") forms.push(paymentForm as any);

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("Form has errors", i);
        setCurrentStepIndex(i > 0 ? i + 1 : i);
        await form.trigger();
        throw new Error("Form has errors");
      }
    }
  }, [accountForm, businessForm, brandingForm, variant, paymentForm]);

  const resetAllForms = useCallback(() => {
    accountForm.reset(accountDefaults);
    businessForm.reset(businessDefaults);
    brandingForm.reset(brandingDefaults);
    paymentForm.reset();
    localStorage.removeItem("paymentForm");
    localStorage.removeItem("completedSteps");
    localStorage.removeItem("last_verified_email");
  }, [accountForm, businessForm, brandingForm, paymentForm]);

  // Final submission
  const handleFinalSubmit = useCallback(async () => {
    try {
      await checkFormsForErrors();
    } catch (error) {
      console.error("Error checking forms for errors:", error);
      toast.error("يرجى التأكد من إدخال البيانات بشكل صحيح");
      return;
    }

    try {
      setIsSubmitting(true);

      // Collect all form data
      const formData = {
        // account: accountForm.getValues(),
        user_id: accountForm.getValues("user_id"),
        business: businessForm.getValues(),
        branding: brandingForm.getValues(),
        ...(variant === "paid" && { payment: paymentForm.getValues() }),
      };

      // console.log("Submitting form data:", formData);

      const res = await axiosInstance.post("/tenants/onboard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      toast.success("جارى انشاء موقعك الاكتروني  🎉");

      resetAllForms();

      router.push(
        "/subscribe/building?tenant_id=" + res?.data.data?.tenant?.id,
      );
    } catch (error) {
      console.error("Submission error:", error);
      if (
        isAxiosError(error)
        // && (error.response?.status === 409 ||
        //   (error.response?.status === 422 &&
        //     error.response?.data.message ===
        //       "The selected user id is invalid."))
      ) {
        toast.error(error?.response?.data?.message || "حدث خطاء ما.");

        if (error?.response?.data?.message === "المستخدم المحدد غير موجود.") {
          resetAllForms();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setCurrentStepIndex(0);
          setCompletedSteps([]);
        } else if (error?.response?.data?.errors) {
          // get step and field error and navigate to them
          const errorSteps: [string, string[]][] = Object.entries(
            error?.response?.data?.errors,
          );

          if (errorSteps?.length > 0) {
            const [step, fieldName] = errorSteps?.[0]?.[0]?.split(".");
            const fieldError = errorSteps?.[0]?.[1]?.[0];

            // get step index and navigate to it
            const stepIndex = steps.findIndex((s) => s?.id === step);
            if (stepIndex !== -1) {
              setCurrentStepIndex(stepIndex);
            }

            const forms = [
              accountForm,
              null,
              businessForm,
              brandingForm,
              paymentForm,
            ];

            const stepForm = forms?.[stepIndex];

            // highlight step form field
            stepForm?.setError(fieldName as any, {
              type: "manual",
              message: fieldError,
            });
          }
        }
      } else {
        toast.error("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    checkFormsForErrors,
    accountForm,
    businessForm,
    brandingForm,
    variant,
    paymentForm,
    resetAllForms,
    router,
    setCompletedSteps,
    steps,
  ]);

  return {
    steps,
    currentStep,
    currentStepIndex,
    setCurrentStepIndex,
    completedSteps,
    emailVerified,
    isSubmitting,
    forms: {
      accountForm,
      businessForm,
      brandingForm,
      paymentForm,
    },
    handlers: {
      handleNext,
      handlePrevious,
      handleFinalSubmit,
      resetEmailVerificationForm,
    },
  };
}
