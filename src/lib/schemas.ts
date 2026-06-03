import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

const onlyLettersRegex = /^[\p{L}\s]+$/u;

const EGYPT_MOBILE_REGEX = /^01[0125][0-9]{8}$/;

// zod helpers
export const phoneEgValidator = ({
  country_iso,
  phone,
  ctx,
  path,
}: {
  country_iso: string;
  phone: string;
  ctx: z.RefinementCtx;
  path: string[];
}) => {
  if (country_iso !== "EG") return;

  // length check (extra safety)
  if (phone.length !== 11) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رقم الهاتف المصري يجب أن يتكون من 11 رقم",
      path,
    });
    return;
  }

  // regex check
  if (!EGYPT_MOBILE_REGEX.test(phone)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "رقم الهاتف المصري غير صالح، يجب أن يبدأ بـ 010 , 011 , 012 , 015",
      path,
    });
  }
};

const phoneCodeValidator = ({
  country_iso,
  phone,
  ctx,
  country,
  path,
}: {
  country_iso: string;
  phone: string;
  ctx: any;
  country: string;
  path: string[];
}) => {
  if (!isValidPhoneNumber(phone, country_iso as CountryCode)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "رقم هاتف غير صالح",
      path: path,
    });
  }

  if (!checkPhoneForCountryCode(phone, country as CountryCode)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "لا تدخل كود الدولة هنا",
      path: path,
    });
  }
};

const checkPhoneForCountryCode = (
  phoneNumber: string,
  country: CountryCode,
) => {
  const phone = phoneNumber?.startsWith("+") ? phoneNumber : `+${phoneNumber}`;

  if (!phone || phone?.startsWith(country)) {
    return false;
  }

  return true;
};

export const phoneSchema = z
  .object({
    country: z.string().min(1, "يجب اختيار كود الدولة"),
    country_iso: z.string().optional(),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .refine((val) => val && !val.startsWith("+"), "لا تدخل كود الدولة هنا"),
  })
  .superRefine(({ phone, country_iso, country }, ctx) => {
    if (country_iso) {
      // custome validations
      phoneEgValidator({
        country_iso,
        phone,
        ctx,
        path: ["phone"],
      });

      // general validations
      phoneCodeValidator({
        country_iso,
        phone,
        ctx,
        country,
        path: ["phone"],
      });
    } else {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "يجب اختيار كود الدولة",
        path: ["phone"],
      });
    }
  });

export const optionalPhoneSchema = z
  .object({
    country: z.string().optional(),
    country_iso: z.string().optional(),
    phone: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const phone = value.phone?.trim() ?? "";
    const country = value.country?.trim() ?? "";
    const countryIso = value.country_iso?.trim() ?? "";

    if (!phone) {
      return;
    }

    const result = phoneSchema.safeParse({
      country,
      country_iso: countryIso,
      phone,
    });

    if (result.success) {
      return;
    }

    for (const issue of result.error.issues) {
      ctx.addIssue(issue);
    }
  });

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "الاسم الأول مطلوب")
      .regex(onlyLettersRegex, "الاسم الأول يجب أن يحتوي على حروف فقط"),
    last_name: z
      .string()
      .min(1, "الاسم الثاني مطلوب")
      .regex(onlyLettersRegex, "الاسم الثاني يجب أن يحتوي على حروف فقط"),
    phones: z
      .object({
        country: z.string().min(1, "يجب اختيار كود الدولة"),
        country_iso: z.string().optional(),

        phone: z
          .string()
          .min(1, "رقم هاتف الطالب مطلوب")
          .refine(
            (val) => val && !val.startsWith("+"),
            "لا تدخل كود الدولة هنا",
          ),
      })
      .superRefine(({ phone, country_iso, country }, ctx) => {
        if (country_iso) {
          // custome validations
          phoneEgValidator({
            country_iso,
            phone,
            ctx,
            path: ["phone"],
          });

          // general validations
          phoneCodeValidator({
            country_iso,
            phone,
            ctx,
            country,
            path: ["phone"],
          });
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "يجب اختيار كود الدولة",
            path: ["phone"],
          });
        }
      }),
    grade_id: z.string().min(1, "يجب تحديد الصف الدراسي"),
    password: z.string().min(8, "كلمة السر يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z
      .string()
      .min(8, "تأكيد كلمة السر يجب أن يكون 8 أحرف على الأقل"),
    recaptcha_token: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمتا السر غير متطابقتين",
    path: ["password_confirmation"],
  });

export const loginSchema = z.object({
  phone: phoneSchema,

  password: z.string().min(8, "يجب أن تكون كلمة السر 8 أحرف على الأقل"),
  recaptcha_token: z.string(),
});

export const otpSchema = z.object({
  otp_code: z.string().min(6, "ادخل رمز التأكد"),
  phone: z.string(),
  recaptcha_token: z.string().optional(),
});

export const forgetPasswordSchema = z.object({
  phone: phoneSchema,
  recaptcha_token: z.string().optional(),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "يجب أن تكون كلمة السر 8 أحرف على الأقل"),
    password_confirmation: z
      .string()
      .min(8, "يجب أن تكون كلمة السر 8 أحرف على الأقل"),
    phone: z.string(),
    recaptcha_token: z.string().optional(),
  })
  .refine((data) => data?.password === data?.password_confirmation, {
    message: "كلمتا السر غير متطابقتين",
    path: ["password_confirmation"],
  });

export const unlockSchema = z.object({
  grade_id: z.number(),
  code: z.string().min(1, "من فضلك ادخل الكود"),
});

export const unlockRoomSchema = z.object({
  center_id: z.number(),
  room_id: z.number(),
  code: z.union([z.string().min(1, "من فضلك ادخل الكود"), z.any()]),
});

export const editProfileSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "الاسم الأول مطلوب")
      .regex(onlyLettersRegex, "يجب أن يحتوي الاسم الأول على حروف فقط"),
    last_name: z
      .string()
      .min(1, "الاسم الأخير مطلوب")
      .regex(onlyLettersRegex, "يجب أن يحتوي الاسم الأخير على حروف فقط"),

    parent_phone: phoneSchema,

    state_id: z.number().min(1, "يجب اختيار المحافظة"),
    city_id: z.coerce
      .number({ required_error: "حقل المدينة مطلوب" })
      .refine((val) => val > 0, "حقل المدينة مطلوب"),

    avatar: z.any(),

    center_id: z.coerce.number().optional(),

    old_password: z
      .string()
      .optional()
      .refine(
        (value) => (value?.length ? value?.length >= 8 : true),
        "يجب أن تكون كلمة السر 8 أحرف على الأقل",
      ),
    password: z
      .string()
      .optional()
      .refine(
        (value) => (value?.length ? value?.length >= 8 : true),
        "يجب أن تكون كلمة السر 8 أحرف على الأقل",
      ),
    password_confirmation: z
      .string()
      .optional()
      .refine(
        (value) => (value?.length ? value?.length >= 8 : true),
        "يجب أن تكون كلمة السر 8 أحرف على الأقل",
      ),
  })
  .superRefine(({ old_password, password, password_confirmation }, ctx) => {
    if (old_password && password && password_confirmation) {
      if (password_confirmation !== password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمتا السر غير متطابقتين",
          path: ["password"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "كلمتا السر غير متطابقتين",
          path: ["password_confirmation"],
        });
      }
    }
    // check if one value is entered the reset should be entered too
    if (old_password || password || password_confirmation) {
      if (!old_password || !password || !password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "يجب إدخال كلمة السر القديمة والجديدة والتأكيد",
          path: ["password_confirmation"],
        });
      }
    }
  });

export const roomIdSChema = z.object({
  center_id: z.coerce.number().min(1, "يجب اختيار سنتر"),
});

export const quizSchema = z.object({
  quiz_id: z.string().min(1, "Quiz ID is required"),
  questions: z
    .record(
      z.union([
        // Option 1: Array of string answer IDs
        z
          .array(z.string().min(1, "Answer ID must be a non-empty string"))
          .min(1, "You must select at least one answer"),

        // Option 2: Object with answer and attachment
        z
          .object({
            text: z.string().optional(),
            attachment: z
              .instanceof(File)
              .nullable()
              .optional()
              .refine(
                (value) => (value?.size ? value?.size < 5000000 : true),
                "Attachment size must be less than 5MB",
              ),
          })
          .superRefine(({ text, attachment }, ctx) => {
            if (!text && !attachment) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "At least one answer type is required",
                path: ["text"],
              });
            }
          }),
      ]),
    )
    .refine(
      (questions) => {
        return Object.values(questions).some((value) => {
          // Check if it's an array with answers
          if (Array.isArray(value)) {
            return value && value?.length > 0;
          }
          // Check if it's an object with answer property
          if (typeof value === "object" && value !== null && "text" in value) {
            return value.text && value.text?.length > 0;
          }
          return false;
        });
      },
      { message: "At least one question must have an answer" },
    ),
});
