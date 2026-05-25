import { phoneSchema } from "@/lib/schemas";
import { DynamicProfileField } from "@/types/auth.types";
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
  "profile_attachments",
  "file",
]);

const isTypeCompatible = (
  field: DynamicProfileField,
  incoming: unknown,
): boolean => {
  if (incoming === null || incoming === undefined) return false;
  if (field.type === "select") {
    if (field.key === "state_id" || field.key === "city_id") {
      return typeof incoming === "string" || typeof incoming === "number";
    }
    const options = field.options ?? [];
    return options.some((opt) => String(opt.value) === String(incoming));
  }
  if (field.type === "profile_attachments" || field.type === "file") {
    return Array.isArray(incoming);
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

    if (field.type === "profile_attachments" || field.type === "file") {
      defaults[field.key] = [];
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
  const toStringPreprocess = (value: unknown) => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  fields.forEach((field) => {
    if (!field.enabled || !SUPPORTED_FIELD_TYPES.has(field.type)) return;
    if (field.key === "avatar") return;

    if (field.type === "phone") {
      shape[field.key] = field.required ? phoneSchema : phoneSchema.optional();
      return;
    }

    if (field.type === "profile_attachments" || field.type === "file") {
      const maxFiles = field.max_files ?? 2;
      const maxSizeMb = field.max_size_mb ?? 10;
      const maxSizeBytes = maxSizeMb * 1024 * 1024;
      const acceptedMimePrefixes = (field.accept ?? []).map((rule) =>
        rule.replace("*", ""),
      );

      const attachmentSchema = z
        .custom<File>((file) => file instanceof File, {
          message: "الملف غير صالح",
        })
        .refine(
          (file) => {
            if (!acceptedMimePrefixes.length) return true;
            return acceptedMimePrefixes.some((prefix) =>
              file.type.startsWith(prefix),
            );
          },
          "نوع الملف غير مدعوم",
        )
        .refine(
          (file) => file.size <= maxSizeBytes,
          `حجم الملف يجب ألا يتجاوز ${maxSizeMb}MB`,
        );

      shape[field.key] = field.required
        ? z
            .array(attachmentSchema)
            .min(1, `${field.label} مطلوب`)
            .max(maxFiles, `الحد الأقصى ${maxFiles} ملفات`)
        : z
            .array(attachmentSchema)
            .max(maxFiles, `الحد الأقصى ${maxFiles} ملفات`)
            .optional();
      return;
    }

    if (
      field.key === "state_id" ||
      field.key === "city_id" ||
      field.type === "select"
    ) {
      shape[field.key] = field.required
        ? z.preprocess(
            toStringPreprocess,
            z.string().min(1, `${field.label} مطلوب`),
          )
        : z.preprocess(toStringPreprocess, z.string().optional());
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

type ProfileFieldStep = DynamicProfileField[];

const ensureStateCityPaired = (
  fields: DynamicProfileField[],
): ProfileFieldStep => {
  const stateField = fields.find((f) => f.key === "state_id");
  const cityField = fields.find((f) => f.key === "city_id");

  if (!stateField || !cityField) return fields;

  const used = new Set<string>();
  const ordered: DynamicProfileField[] = [];

  for (const field of fields) {
    if (used.has(field.key)) continue;

    if (field.key === "state_id" || field.key === "city_id") {
      if (!used.has("state_id")) {
        ordered.push(stateField);
        used.add("state_id");
      }
      if (!used.has("city_id")) {
        ordered.push(cityField);
        used.add("city_id");
      }
      continue;
    }

    ordered.push(field);
    used.add(field.key);
  }

  return ordered;
};

export const buildProfileCompletionSteps = (
  fields: DynamicProfileField[],
): ProfileFieldStep[] => {
  const normalized = ensureStateCityPaired(fields);
  const total = normalized.length;

  if (total === 0) return [];
  if (total < 8) return [normalized];

  const minFieldsPerStep = 3;
  const maxSteps = 4;

  const maxAllowedStepsByMinFields = Math.max(
    1,
    Math.floor(total / minFieldsPerStep),
  );
  const stepCount = Math.min(
    maxSteps,
    Math.max(2, Math.ceil(total / 5)),
    maxAllowedStepsByMinFields,
  );

  const steps: ProfileFieldStep[] = [];
  let start = 0;
  let remainingFields = total;

  for (let i = 0; i < stepCount; i++) {
    const remainingSteps = stepCount - i;
    const target = Math.ceil(remainingFields / remainingSteps);
    const maxEnd = total - (remainingSteps - 1) * minFieldsPerStep;
    const end = i === stepCount - 1 ? total : Math.min(start + target, maxEnd);

    steps.push(normalized.slice(start, end));
    remainingFields -= end - start;
    start = end;
  }

  for (let i = steps.length - 1; i > 0; i--) {
    if (steps[i].length <= 2) {
      steps[i - 1] = [...steps[i - 1], ...steps[i]];
      steps.splice(i, 1);
    }
  }

  return steps;
};
