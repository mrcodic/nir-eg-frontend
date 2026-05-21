import { z } from "zod";

const onlyLettersRegex = /^[\p{L}\s]+$/u;

export const registerCoreSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "الاسم الأول مطلوب")
      .regex(onlyLettersRegex, "الاسم الأول يجب أن يحتوي على حروف فقط"),
    last_name: z
      .string()
      .min(1, "الاسم الثاني مطلوب")
      .regex(onlyLettersRegex, "الاسم الثاني يجب أن يحتوي على حروف فقط"),
    phones: z.object({
      country: z.string().min(1, "كود الدولة مطلوب"),
      country_iso: z.string().optional(),
      phone: z
        .string()
        .min(1, "رقم الهاتف مطلوب")
        .regex(/^\d+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
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

