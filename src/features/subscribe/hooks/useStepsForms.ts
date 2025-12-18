import { PREDEFINED_COLORS } from "@/constants/template";
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
import { PaymentPeriod } from "@/types/subscribe.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
  period: PaymentPeriod;
  planId?: string;
};

function useStepsForms({ period, planId }: Props) {
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

  const verifyForm = useForm<EmailVerifyFormData>({
    resolver: zodResolver(emailVerifySchema),
    defaultValues: {
      otp: "",
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
      // country: "egypt",
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

  return {
    accountForm,
    verifyForm,
    businessForm,
    brandingForm,
    paymentForm,
  };
}

export default useStepsForms;
