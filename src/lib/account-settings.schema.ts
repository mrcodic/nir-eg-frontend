import { phoneSchema } from "@/lib/schemas";
import { DynamicProfileField } from "@/types/auth.types";
import { z } from "zod";

import { buildProfileCompletionSchema } from "@/helpers/profile-completion.helpers";

const LETTERS_REGEX = /^[\p{L}\s]+$/u;

export const buildAccountSettingsSchema = ({
  dynamicFields,
  dynamicFieldKeys,
}: {
  dynamicFields: DynamicProfileField[];
  dynamicFieldKeys: Set<string>;
}) => {
  const hasParentPhoneDynamic = dynamicFieldKeys.has("parent_phone");
  const hasStateDynamic = dynamicFieldKeys.has("state_id");
  const hasCityDynamic = dynamicFieldKeys.has("city_id");

  const staticBaseSchema = z.object({
    first_name: z
      .string()
      .min(1, "الاسم الأول مطلوب")
      .regex(LETTERS_REGEX, "يجب أن يحتوي الاسم الأول على حروف فقط"),
    last_name: z
      .string()
      .min(1, "الاسم الأخير مطلوب")
      .regex(LETTERS_REGEX, "يجب أن يحتوي الاسم الأخير على حروف فقط"),
    parent_phone: hasParentPhoneDynamic ? phoneSchema.optional() : phoneSchema,
    state_id: hasStateDynamic
      ? z.union([z.string(), z.number()]).optional()
      : z.coerce.number().min(1, "يجب اختيار المحافظة"),
    city_id: hasCityDynamic
      ? z.union([z.string(), z.number()]).optional()
      : z.coerce.number().refine((value) => value > 0, "حقل المدينة مطلوب"),
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

