import { z } from "zod";

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FAVICON_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB

const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

const imageFileSchema = (maxSize: number, label: string) =>
  z
    .instanceof(File)
    .refine((file) => IMAGE_MIME_TYPES.includes(file.type), {
      message: `${label} يجب أن يكون صورة`,
    })
    .refine((file) => file.size <= maxSize, {
      message: `${label} يجب ألا يتجاوز ${(maxSize / 1024 / 1024).toFixed(
        0,
      )} ميجابايت`,
    });

// ==========================================
// Step 1: Account Information Schema
// ==========================================
export const accountInfoSchema = z
  .object({
    first_name: z
      .string()
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
      .max(100, "الاسم يجب أن يكون أقل من 100 حرف"),
    last_name: z
      .string()
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
      .max(100, "الاسم يجب أن يكون أقل من 100 حرف"),
    email: z
      .string()
      .email("البريد الإلكتروني غير صالح")
      .min(1, "البريد الإلكتروني مطلوب"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .transform((val) => {
        // Remove all non-digit characters except +
        return val.replace(/[\s\-()]/g, "");
      })
      .pipe(
        z
          .string()
          .superRefine((val, ctx) => {
            const cleaned = val.replace(/^\+/, "");

            // Check if contains only valid characters
            if (!/^[\+\d]+$/.test(val)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "رقم الهاتف يجب أن يحتوي على أرقام فقط",
              });
              return;
            }

            // Handle international format
            if (val.startsWith("+20") || cleaned.startsWith("0020")) {
              const withoutCountryCode = cleaned.replace(/^0020|^20/, "");

              // Check if number exists after country code
              if (!withoutCountryCode) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "رقم الهاتف غير مكتمل بعد كود الدولة",
                });
                return;
              }

              // Check if starts with 01
              if (!withoutCountryCode.startsWith("01")) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "رقم الموبايل يجب أن يبدأ بـ 01",
                });
                return;
              }

              // Check valid carrier prefix
              if (!/^01[0125]/.test(withoutCountryCode)) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message:
                    "كود الشبكة غير صالح. استخدم 010 (فودافون)، 011 (اتصالات)، 012 (أورانج)، أو 015 (WE)",
                });
                return;
              }

              // Check total length (must be 11 digits)
              if (withoutCountryCode.length !== 11) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `رقم الموبايل يجب أن يكون 11 رقم (حالياً ${withoutCountryCode.length} رقم)`,
                });
                return;
              }

              // Valid international format
              return;
            }

            // Handle local format
            // Check if starts with 01
            if (!cleaned.startsWith("01")) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "رقم الموبايل يجب أن يبدأ بـ 01",
              });
              return;
            }

            // Check length first
            if (cleaned.length < 11) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `رقم الموبايل قصير جداً (حالياً ${cleaned.length} رقم، المطلوب 11 رقم)`,
              });
              return;
            }

            if (cleaned.length > 11) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `رقم الموبايل طويل جداً (حالياً ${cleaned.length} رقم، المطلوب 11 رقم)`,
              });
              return;
            }

            // Check valid carrier prefix
            if (!/^01[0125]/.test(cleaned)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "كود الشبكة غير صالح. استخدم 010 (فودافون)، 011 (اتصالات)، 012 (أورانج)، أو 015 (WE)",
              });
              return;
            }

            // Final pattern validation
            if (!/^01[0125]\d{8}$/.test(cleaned)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "رقم الموبايل المصري غير صالح",
              });
              return;
            }
          })
          .transform((val) => {
            return val.replace(/^\+/, "");
          }),
      ),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم",
      ),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    // language: z.string().min(1, "اللغة مطلوبة"),
    timezone: z.string().min(1, "المنطقة الزمنية مطلوبة"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
    acceptPrivacy: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على سياسة الخصوصية",
    }),
    acceptSms: z.boolean(),
    acceptWhatsapp: z.boolean(),

    user_id: z.number().optional(),
    email_verified: z.boolean().optional(),
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
  teacherType: z.enum(["individual", "center"], {
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
  teachingMethod: z.enum(["online", "offline", "mixed"], {
    message: "طريقة التدريس مطلوبة",
  }),
  expectedStudents: z
    .number()
    .min(1, "عدد الطلاب يجب أن يكون 1 على الأقل")
    .max(100000, "عدد الطلاب يجب أن يكون أقل من 100000"),
  country: z.string().min(1, "الدولة مطلوبة"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  city: z.string().optional(),
  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  howDidYouHear: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// ==========================================
// Step 4: Website & Branding Schema
// ==========================================
export const brandingSchema = z
  .object({
    domainType: z.enum(["custom", "subdomain"], {
      message: "يجب اختيار نوع النطاق",
    }),

    websiteName: z
      .string()
      .min(3, "اسم الموقع يجب أن يكون 3 أحرف على الأقل")
      .max(50, "اسم الموقع يجب أن يكون أقل من 50 حرف"),

    brandColor: z.string().min(1, "يجب اختيار لون الموقع"),
    selectedTemplate: z.string().min(1, "يجب اختيار قالب للموقع"),

    logoFile: imageFileSchema(MAX_LOGO_SIZE, "اللوجو").nullable(),

    faviconFile: imageFileSchema(MAX_FAVICON_SIZE, "الأيقونة").nullable(),

    coverFile: imageFileSchema(MAX_COVER_SIZE, "صورة الغلاف")
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { domainType, websiteName, logoFile, faviconFile } = data;

    // 🔴 REQUIRED CHECKS (AFTER defaults)
    if (!logoFile) {
      ctx.addIssue({
        path: ["logoFile"],
        message: "يجب رفع اللوجو الخاص بالموقع",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!faviconFile) {
      ctx.addIssue({
        path: ["faviconFile"],
        message: "يجب رفع أيقونة الموقع",
        code: z.ZodIssueCode.custom,
      });
    }

    // Regex for subdomain (your original)
    const subDomainRegex = /^[a-zA-Z0-9-]+$/;

    // Regex for full domain (example: example.com, my-site.co.uk, etc.)
    const fullDomainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (domainType === "subdomain") {
      if (!subDomainRegex.test(websiteName)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["websiteName"],
          message:
            "اسم الموقع يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط",
        });
      }
    }

    if (domainType === "custom") {
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
  planId: z.string().min(1, "يجب اختيار نوع الخطة"),
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
