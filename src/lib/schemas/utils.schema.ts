import z from "zod";

export const phoneSchema = z
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
  );
