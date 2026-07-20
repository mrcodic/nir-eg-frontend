import { z } from "zod";

const arabicNamePattern = /^[\p{L}\s]+$/u;
const egyptianMobileNumberPattern = /^01[0125]\d{8}$/;

export const summaryBookingSchema = z.object({
  applicantType: z.enum(["student", "guardian"], {
    required_error: "يرجى تحديد مقدم الطلب",
  }),
  firstName: z
    .string()
    .trim()
    .min(2, "الاسم الأول مطلوب")
    .regex(arabicNamePattern, "الاسم الأول يجب أن يحتوي على حروف فقط"),
  lastName: z
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
  grade: z.enum(["first", "second", "third"], {
    required_error: "يرجى اختيار السنة الدراسية",
  }),
});
