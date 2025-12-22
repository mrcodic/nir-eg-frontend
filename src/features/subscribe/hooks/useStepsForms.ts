"use client";

import { PREDEFINED_COLORS } from "@/constants/template";
import useFormPersist from "@/hooks/useFormPersist";
import {
  AccountInfoFormData,
  accountInfoSchema,
  BrandingFormData,
  brandingSchema,
  BusinessInfoFormData,
  businessInfoSchema,
  PaymentFormData,
  paymentSchema,
} from "@/lib/schemas/subscribe.schema";
import { PaymentPeriod, StepId } from "@/types/subscribe.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  period: PaymentPeriod;
  planId?: string;
};

// Helper to get stored form data
function getStoredFormData<T>(key: string, defaultValues: T): T {
  if (typeof window === "undefined") return defaultValues;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValues;

    const parsed = JSON.parse(stored);
    const { _timestamp, ...values } = parsed;

    // Merge stored values with defaults (defaults take precedence for missing keys)
    return { ...defaultValues, ...values };
  } catch (error) {
    console.error(`Failed to restore ${key}:`, error);
    return defaultValues;
  }
}

function useStepsForms({ period, planId }: Props) {
  const [completedSteps, setCompletedSteps] = useLocalStorage<StepId[]>(
    "completedSteps",
    [],
    {
      initializeWithValue: false,
    }
  );

  // Get stored values BEFORE form initialization
  const accountDefaultValues = useMemo(
    () =>
      getStoredFormData<AccountInfoFormData>("accountForm", {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        timezone: "Africa/Cairo",
        acceptTerms: false,
        acceptPrivacy: false,
        acceptSms: false,
        acceptWhatsapp: false,
        user_id: undefined,
        email_verified: false,
      }),
    []
  );

  const businessDefaultValues = useMemo(
    () =>
      getStoredFormData<BusinessInfoFormData>("businessForm", {
        teacherType: "individual",
        brandName: "",
        legalName: "",
        subjects: [],
        gradeLevels: [],
        teachingMethod: "mixed",
        expectedStudents: 20,
        country: "مصر",
        governorate: "",
        city: "",
        address: "",
        howDidYouHear: "",
        additionalNotes: "",
      }),
    []
  );

  const brandingDefaultValues = useMemo(
    () =>
      getStoredFormData<BrandingFormData>("brandingForm", {
        domainType: "subdomain",
        websiteName: "",
        brandColor: PREDEFINED_COLORS[0],
        selectedTemplate: "",
        logoFile: null,
        faviconFile: null,
        coverFile: null,
      }),
    []
  );

  const paymentDefaultValues = useMemo(
    () =>
      getStoredFormData<PaymentFormData>("paymentForm", {
        planId: planId || "",
        paymentPeriod: period || "yearly",
        paymentMethod: "e-wallet",
      }),
    [period, planId]
  );

  // Initialize forms with stored values
  const accountForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: accountDefaultValues,
  });

  const businessForm = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: businessDefaultValues,
  });

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: brandingDefaultValues,
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentDefaultValues,
  });

  // Persist changes (only watches for changes, doesn't restore)
  useFormPersist("accountForm", {
    watch: accountForm.watch,
    setValue: accountForm.setValue,
  });

  useFormPersist("businessForm", {
    watch: businessForm.watch,
    setValue: businessForm.setValue,
  });

  useFormPersist("brandingForm", {
    watch: brandingForm.watch,
    setValue: brandingForm.setValue,
    exclude: ["logoFile", "faviconFile", "coverFile"],
  });

  useFormPersist("paymentForm", {
    watch: paymentForm.watch,
    setValue: paymentForm.setValue,
  });

  return {
    accountForm,
    businessForm,
    brandingForm,
    paymentForm,
    completedSteps,
    setCompletedSteps,
  };
}

export default useStepsForms;
