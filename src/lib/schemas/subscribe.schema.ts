import { z } from "zod";

// ==========================================
// Step 1: Account Information Schema
// ==========================================
export const accountInfoSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
      .max(100, "الاسم يجب أن يكون أقل من 100 حرف"),
    email: z
      .string()
      .email("البريد الإلكتروني غير صالح")
      .min(1, "البريد الإلكتروني مطلوب"),
    phone: z
      .string()
      .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
      .regex(/^[0-9+]+$/, "رقم الهاتف غير صالح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم"
      ),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    language: z.string().min(1, "اللغة مطلوبة"),
    timezone: z.string().min(1, "المنطقة الزمنية مطلوبة"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
    acceptPrivacy: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على سياسة الخصوصية",
    }),
    acceptSms: z.boolean(),
    acceptWhatsapp: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

// ==========================================
// Step 2: Email Verification Schema
// ==========================================
export const emailVerifySchema = z.object({
  otp: z
    .string()
    .length(6, "رمز التحقق يجب أن يكون 6 أرقام")
    .regex(/^\d+$/, "رمز التحقق يجب أن يحتوي على أرقام فقط"),
});

// ==========================================
// Step 3: Business Details Schema
// ==========================================
export const businessInfoSchema = z.object({
  teacherType: z.enum(["individual", "institution"], {
    message: "نوع المدرس مطلوب",
  }),
  brandName: z
    .string()
    .min(2, "اسم العلامة التجارية يجب أن يكون حرفين على الأقل")
    .max(100, "اسم العلامة التجارية يجب أن يكون أقل من 100 حرف"),
  legalName: z
    .string()
    .min(2, "الاسم القانوني يجب أن يكون حرفين على الأقل")
    .max(100, "الاسم القانوني يجب أن يكون أقل من 100 حرف"),
  subjects: z
    .array(z.string())
    .min(1, "يجب اختيار مادة دراسية واحدة على الأقل"),
  gradeLevels: z.array(z.string()).min(1, "يجب اختيار صف دراسي واحد على الأقل"),
  teachingMethod: z.enum(["online", "offline", "hybrid"], {
    message: "طريقة التدريس مطلوبة",
  }),
  expectedStudents: z
    .number()
    .min(1, "عدد الطلاب يجب أن يكون 1 على الأقل")
    .max(100000, "عدد الطلاب يجب أن يكون أقل من 100000"),
  country: z.string().min(1, "الدولة مطلوبة"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  howDidYouHear: z.string().optional(),
  additionalNotes: z.string().optional(),
  discountCode: z.string().optional(),
});

// ==========================================
// Step 4: Website & Branding Schema
// ==========================================
export const brandingSchema = z
  .object({
    domainType: z.enum(["full-domain", "sub-domain"], {
      message: "يجب اختيار نوع النطاق",
    }),

    websiteName: z
      .string()
      .min(3, "اسم الموقع يجب أن يكون 3 أحرف على الأقل")
      .max(50, "اسم الموقع يجب أن يكون أقل من 50 حرف"),

    brandColor: z.string().min(1, "يجب اختيار لون الموقع"),
    selectedTemplate: z.string().min(1, "يجب اختيار قالب للموقع"),
    logoFile: z.any().optional().nullable(),
    faviconFile: z.any().optional().nullable(),
    coverFile: z.any().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const { domainType, websiteName } = data;

    // Regex for subdomain (your original)
    const subDomainRegex = /^[a-zA-Z0-9-]+$/;

    // Regex for full domain (example: example.com, my-site.co.uk, etc.)
    const fullDomainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (domainType === "sub-domain") {
      if (!subDomainRegex.test(websiteName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["websiteName"],
          message:
            "اسم الموقع يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط",
        });
      }
    }

    if (domainType === "full-domain") {
      if (!fullDomainRegex.test(websiteName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["websiteName"],
          message: "يجب إدخال دومين كامل وصحيح مثل: example.com",
        });
      }
    }
  });

// ==========================================
// Step 5: Payment Schema (Paid only)
// ==========================================
export const paymentSchema = z.object({
  paymentPeriod: z.enum(["monthly", "yearly"], {
    message: "طريقة الدفع مطلوبة",
  }),
  paymentMethod: z.enum(["e-wallet", "bank-account"], {
    message: "وسيلة الدفع مطلوبة",
  }),
});

// ==========================================
// Combined Schema Types
// ==========================================
export type AccountInfoFormData = z.infer<typeof accountInfoSchema>;
export type EmailVerifyFormData = z.infer<typeof emailVerifySchema>;
export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type BrandingFormData = z.infer<typeof brandingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;

// Full form schema for demo (4 steps)
export const demoFormSchema = z.object({
  account: accountInfoSchema,
  verify: emailVerifySchema,
  business: businessInfoSchema,
  branding: brandingSchema,
});

// Full form schema for paid (5 steps)
export const paidFormSchema = z.object({
  account: accountInfoSchema,
  verify: emailVerifySchema,
  business: businessInfoSchema,
  branding: brandingSchema,
  payment: paymentSchema,
});

export type DemoFormData = z.infer<typeof demoFormSchema>;
export type PaidFormData = z.infer<typeof paidFormSchema>;
