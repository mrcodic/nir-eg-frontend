import { DynamicProfileField } from "@/types/auth.types";
import { phoneSchema } from "@/lib/schemas";
import { z } from "zod";

export type ProfileCompletionValues = Record<string, unknown>;

export const FALLBACK_STUDENT_TYPE_OPTIONS = [
  { value: "4", label: "أونلاين" },
  { value: "3", label: "حضوري / سنتر" },
  { value: "5", label: "طالب كود سنتر" },
];

export const SUPPORTED_FIELD_TYPES = new Set([
  "text",
  "phone",
  "select",
  "date",
  "textarea",
  "email",
]);

const isTypeCompatible = (
  field: DynamicProfileField,
  incoming: unknown,
): boolean => {
  if (incoming === null || incoming === undefined) return false;
  if (field.type === "select") {
    const options = field.options ?? [];
    return options.some((opt) => String(opt.value) === String(incoming));
  }
  return typeof incoming === "string" || typeof incoming === "number";
};

const normalizeSelectValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "";
  if (key === "state_id" || key === "city_id" || key === "student_type") {
    return String(Number(value));
  }
  return String(value);
};

export const buildProfileCompletionDefaults = (
  fields: DynamicProfileField[],
  prefillData?: Record<string, unknown> | null,
): ProfileCompletionValues => {
  const defaults: ProfileCompletionValues = {};

  fields.forEach((field) => {
    const candidate = prefillData?.[field.key];
    if (field.type === "phone") {
      const rawValue =
        isTypeCompatible(field, candidate)
          ? candidate
          : field.value !== null && field.value !== undefined && field.value !== ""
            ? field.value
            : "";

      defaults[field.key] = {
        country: "+20",
        country_iso: "EG",
        phone: rawValue ? String(rawValue) : "",
      };
      return;
    }

    if (isTypeCompatible(field, candidate)) {
      defaults[field.key] =
        field.type === "select"
          ? normalizeSelectValue(field.key, candidate)
          : String(candidate);
      return;
    }

    if (
      field.value !== null &&
      field.value !== undefined &&
      field.value !== "" &&
      (field.type !== "select" || isTypeCompatible(field, field.value))
    ) {
      defaults[field.key] =
        field.type === "select"
          ? normalizeSelectValue(field.key, field.value)
          : String(field.value);
      return;
    }

    defaults[field.key] = "";
  });

  return defaults;
};

export const buildProfileCompletionSchema = (fields: DynamicProfileField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (!field.enabled || !SUPPORTED_FIELD_TYPES.has(field.type)) return;
    if (field.key === "avatar") return;

    if (field.type === "phone") {
      shape[field.key] = field.required
        ? phoneSchema
        : phoneSchema.optional();
      return;
    }

    if (field.key === "state_id" || field.key === "city_id" || field.type === "select") {
      shape[field.key] = field.required
        ? z.string().min(1, `${field.label} مطلوب`)
        : z.string().optional();
      return;
    }

    if (field.type === "email") {
      shape[field.key] = field.required
        ? z.string().min(1, `${field.label} مطلوب`).email("بريد إلكتروني غير صالح")
        : z.string().optional();
      return;
    }

    if (field.type === "date") {
      shape[field.key] = field.required
        ? z.string().min(1, `${field.label} مطلوب`)
        : z.string().optional();
      return;
    }

    shape[field.key] = field.required
      ? z.string().min(1, `${field.label} مطلوب`)
      : z.string().optional();
  });

  return z.object(shape);
};
