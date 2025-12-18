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
  EmailVerifyFormData,
  emailVerifySchema,
  PaymentFormData,
  paymentSchema,
} from "@/lib/schemas/subscribe.schema";
import { PaymentPeriod, StepId } from "@/types/subscribe.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import useFormPersist from "react-hook-form-persist";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  period: PaymentPeriod;
  planId?: string;
};

function useStepsForms({ period, planId }: Props) {
  const [completedSteps, setCompletedSteps] = useLocalStorage<StepId[]>(
    "completedSteps",
    [],
    {
      initializeWithValue: false,
    }
  );

  const accountForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
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
    },
  });

  useFormPersist("accountForm", {
    watch: accountForm.watch,
    setValue: accountForm.setValue,
  });

  const verifyForm = useForm<EmailVerifyFormData>({
    resolver: zodResolver(emailVerifySchema),
    defaultValues: {
      otp: "",
    },
  });

  useFormPersist("verifyForm", {
    watch: verifyForm.watch,
    setValue: verifyForm.setValue,
  });

  const businessForm = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      teacherType: "individual",
      brandName: "",
      legalName: "",
      subjects: [],
      gradeLevels: [],
      teachingMethod: "mixed",
      expectedStudents: 20,
      // country: "egypt",
      governorate: "",
      city: "",
      address: "",
      howDidYouHear: "",
      additionalNotes: "",
    },
  });

  useFormPersist("businessForm", {
    watch: businessForm.watch,
    setValue: businessForm.setValue,
  });

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      domainType: "subdomain", // or custom
      websiteName: "",
      brandColor: PREDEFINED_COLORS[0], // Default Blue #2E76AD
      selectedTemplate: "",
      logoFile: null,
      faviconFile: null,
      coverFile: null,
    },
  });

  useFormPersist("brandingForm", {
    watch: brandingForm.watch,
    setValue: brandingForm.setValue,
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      planId: planId || "",
      paymentPeriod: period || "yearly",
      paymentMethod: "e-wallet",
    },
  });

  useFormPersist("paymentForm", {
    watch: paymentForm.watch,
    setValue: paymentForm.setValue,
  });

  return {
    accountForm,
    verifyForm,
    businessForm,
    brandingForm,
    paymentForm,
    completedSteps,
    setCompletedSteps,
  };
}

export default useStepsForms;
