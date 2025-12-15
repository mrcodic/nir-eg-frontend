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
};

function useStepsForms({ period }: Props) {
  const accountForm = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      language: "ar",
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
      teachingMethod: "hybrid",
      expectedStudents: 20,
      country: "egypt",
      governorate: "",
      city: "",
      address: "",
      howDidYouHear: "",
      additionalNotes: "",
      discountCode: "",
    },
  });

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      domainType: "sub-domain", // or full-domain
      websiteName: "",
      selectedTemplate: "",
      logoFile: null,
      faviconFile: null,
      coverFile: null,
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
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
