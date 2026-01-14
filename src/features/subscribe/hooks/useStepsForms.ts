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
  selectedTemplate: "landing-v1",
  logoFile: null,
  faviconFile: null,
  coverFile: null,
};

function useStepsForms({ period, planId }: Props) {
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
    defaultValues: getStoredFormData("accountForm", accountDefaults),
  });

  const businessForm = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: getStoredFormData("businessForm", businessDefaults),
  });

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: getStoredFormData("brandingForm", brandingDefaults),
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: getStoredFormData("paymentForm", paymentDefaults),
  });

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

  // useFormPersist("paymentForm", {
  //   watch: paymentForm.watch,
  //   setValue: paymentForm.setValue,
  // });

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
