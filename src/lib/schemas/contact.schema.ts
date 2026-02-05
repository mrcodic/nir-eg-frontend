import { z } from "zod";
import { phoneSchema } from "./utils.schema";

export const contactSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.email("البريد الإلكتروني غير صالح"),
  role: z.enum(["student", "educator", "company", "other"], {
    error: "اختر الوظيفة / الدور",
  }),

  // Optional fields
  phone: phoneSchema,

  institution: z.string().min(1, "المؤسسة / الجهة مطلوبة"),
  message: z.string().min(1, "الرسالة مطلوبة"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
