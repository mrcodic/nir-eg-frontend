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
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  period: PaymentPeriod;
  planId?: string;
};

function getStoredFormData<T>(key: string, defaultValues: T): T {
  if (typeof window === "undefined") return defaultValues;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValues;

    const parsed = JSON.parse(stored);
    const { _timestamp, ...values } = parsed;

    return { ...defaultValues, ...values };
  } catch (error) {
    console.error(`Failed to restore ${key}:`, error);
    return defaultValues;
  }
}

// Define default values as constants
const accountDefaults: AccountInfoFormData = {
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
};

const businessDefaults: BusinessInfoFormData = {
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
};

const brandingDefaults: BrandingFormData = {
  domainType: "subdomain",
  websiteName: "",
  brandColor: PREDEFINED_COLORS[0],
  selectedTemplate: "",
  logoFile: null,
  faviconFile: null,
  coverFile: null,
};

function useStepsForms({ period, planId }: Props) {
  const isRestoredRef = useRef(false);

  const [completedSteps, setCompletedSteps] = useLocalStorage<StepId[]>(
    "completedSteps",
    [],
    {
      initializeWithValue: false,
    }
  );

  const paymentDefaults: PaymentFormData = {
    planId: planId || "",
    paymentPeriod: period || "yearly",
    paymentMethod: "e-wallet",
  };

  // Initialize forms with synchronous defaults (no async)
  const accountForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: accountDefaults,
  });

  const businessForm = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: businessDefaults,
  });

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: brandingDefaults,
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentDefaults,
  });

  // Restore from localStorage ONCE after mount
  useEffect(() => {
    if (isRestoredRef.current) return;

    // Small delay to ensure forms are fully mounted
    const timeoutId = setTimeout(() => {
      const accountStored = getStoredFormData("accountForm", accountDefaults);
      const businessStored = getStoredFormData(
        "businessForm",
        businessDefaults
      );
      const brandingStored = getStoredFormData(
        "brandingForm",
        brandingDefaults
      );
      const paymentStored = getStoredFormData("paymentForm", paymentDefaults);

      // Reset forms with stored values
      accountForm.reset(accountStored, { keepDefaultValues: false });
      businessForm.reset(businessStored, { keepDefaultValues: false });
      brandingForm.reset(brandingStored, { keepDefaultValues: false });
      paymentForm.reset(paymentStored, { keepDefaultValues: false });

      isRestoredRef.current = true;
    }, 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run only once

  // Persist changes
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
