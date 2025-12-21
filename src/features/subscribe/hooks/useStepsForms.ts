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
      user_id: undefined,
      email_verified: false,
    },
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
      country: "مصر",
      governorate: "",
      city: "",
      address: "",
      howDidYouHear: "",
      additionalNotes: "",
    },
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

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      planId: planId || "",
      paymentPeriod: period || "yearly",
      paymentMethod: "e-wallet",
    },
  });

  useFormPersist("accountForm", {
    watch: accountForm.watch,
    setValue: accountForm.setValue,
  });

  // useFormPersist("verifyForm", {
  //   watch: verifyForm.watch,
  //   setValue: verifyForm.setValue,
  // });

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
