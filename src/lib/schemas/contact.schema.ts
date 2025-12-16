import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.email("البريد الإلكتروني غير صالح"),
  role: z.enum(["student", "educator", "company", "other"], {
    error: "اختر الوظيفة / الدور",
  }),

  // Optional fields
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[+0-9\-\s]{6,20}$/.test(v), {
      message: "رقم الهاتف غير صالح",
    }),

  institution: z.string().min(1, "المؤسسة / الجهة مطلوبة"),
  message: z.string().min(1, "الرسالة مطلوبة"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
