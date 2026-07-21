import { z } from "zod";

const arabicNamePattern = /^[\p{L}\s]+$/u;
const egyptianMobileNumberPattern = /^01[0125]\d{8}$/;
const requiredIdMessage = "يرجى اختيار قيمة صحيحة";
const requiredIdSchema = z.coerce
  .number({
    required_error: requiredIdMessage,
    invalid_type_error: requiredIdMessage,
  })
  .int()
  .positive(requiredIdMessage);

export const summaryBookingSchema = z.object({
  type: z.coerce
    .number()
    .refine((value) => value === 0 || value === 1, "يرجى تحديد مقدم الطلب"),
  first_name: z
    .string()
    .trim()
    .min(2, "الاسم الأول مطلوب")
    .regex(arabicNamePattern, "الاسم الأول يجب أن يحتوي على حروف فقط"),
  last_name: z
    .string()
    .trim()
    .min(2, "الاسم الأخير مطلوب")
    .regex(arabicNamePattern, "الاسم الأخير يجب أن يحتوي على حروف فقط"),
  phone: z
    .string()
    .trim()
    .min(1, "رقم هاتف الطالب مطلوب")
    .regex(
      egyptianMobileNumberPattern,
      "أدخل رقم هاتف مصري مكونًا من 11 رقمًا ويبدأ بـ 010 أو 011 أو 012 أو 015",
    ),
  grade_id: requiredIdSchema,
  state_id: requiredIdSchema,
  city_id: requiredIdSchema,
});
