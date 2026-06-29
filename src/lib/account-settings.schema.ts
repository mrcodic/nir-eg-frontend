import { buildProfileCompletionSchema } from "@/helpers/profile-completion.helpers";
import { phoneSchema } from "@/lib/schemas";
import { DynamicProfileField } from "@/types/auth.types";
import { z } from "zod";

export const buildAccountSettingsSchema = ({
  dynamicFields,
}: {
  dynamicFields: DynamicProfileField[];
}) => {
  const staticBaseSchema = z.object({
    first_name: z.string().min(1, "الاسم الأول مطلوب"),
    phone: phoneSchema,
    center_id: z.coerce.number().optional(),
    avatar: z.any().optional(),
    old_password: z
      .string()
      .optional()
      .refine(
        (value) => (value?.length ? value.length >= 8 : true),
        "يجب أن تكون كلمة السر 8 أحرف على الأقل",
      ),
    password: z
      .string()
      .optional()
      .refine(
        (value) => (value?.length ? value.length >= 8 : true),
        "يجب أن تكون كلمة السر 8 أحرف على الأقل",
      ),
    password_confirmation: z
      .string()
      .optional()
      .refine(
        (value) => (value?.length ? value.length >= 8 : true),
        "يجب أن تكون كلمة السر 8 أحرف على الأقل",
      ),
  });

  const dynamicSchema = buildProfileCompletionSchema(dynamicFields);

  return staticBaseSchema
    .merge(dynamicSchema)
    .superRefine(({ old_password, password, password_confirmation }, ctx) => {
      if (old_password || password || password_confirmation) {
        if (!old_password || !password || !password_confirmation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "يجب إدخال كلمة السر القديمة والجديدة والتأكيد",
            path: ["password_confirmation"],
          });
        }
      }

      if (
        old_password &&
        password &&
        password_confirmation &&
        password !== password_confirmation
      ) {
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
    });
};
