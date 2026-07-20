import { optionalPhoneSchema, phoneSchema } from "@/schemas/auth.schema";
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

const onlyLettersRegex = /^[\p{L}\s]+$/u;
const onlyDigitsRegex = /^\d+$/;

const LETTERS_ONLY_FIELD_KEYS = new Set([
  "parent_name",
  "father_name",
  "mother_name",
]);

const DIGITS_ONLY_FIELD_KEYS = new Set(["national_id"]);

const NATIONAL_ID_FIELD_KEYS = new Set(["national_id"]);

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

const normalizeSelectValue = (_key: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "";
  return String(value); // ← simplest possible, always returns string
};

export const buildProfileCompletionDefaults = (
  fields: DynamicProfileField[],
  prefillData?: Record<string, unknown> | null,
): ProfileCompletionValues => {
  const defaults: ProfileCompletionValues = {};

  fields.forEach((field) => {
    const candidate =
      prefillData?.[field.key === "student_type" ? "type" : field.key];
    if (field.type === "phone") {
      const rawValue = isTypeCompatible(field, candidate)
        ? candidate
        : field.value !== null &&
            field.value !== undefined &&
            field.value !== ""
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
      if (Array.isArray(candidate)) {
        defaults[field.key] = candidate;
        return;
      }
      if (Array.isArray(field.value)) {
        defaults[field.key] = field.value;
        return;
      }
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

const toStringPreprocess = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const toOptionalTrimmedString = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return String(value).trim();
};

const toRequiredTrimmedString = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const buildTextLikeSchema = (field: DynamicProfileField) => {
  const baseSchema = field.required
    ? z.preprocess(
        toRequiredTrimmedString,
        z.string().min(1, `${field.label} مطلوب`),
      )
    : z.preprocess(toOptionalTrimmedString, z.string().optional());

  if (LETTERS_ONLY_FIELD_KEYS.has(field.key)) {
    return baseSchema.refine(
      (value) =>
        value === undefined || value === "" || onlyLettersRegex.test(value),
      `${field.label} يجب أن يحتوي على حروف فقط`,
    );
  }

  if (DIGITS_ONLY_FIELD_KEYS.has(field.key)) {
    return baseSchema
      .refine(
        (value) => value === undefined || value === "" || onlyDigitsRegex.test(value),
        `${field.label} يجب أن يحتوي على أرقام فقط`,
      )
      .refine(
        (value) =>
          !NATIONAL_ID_FIELD_KEYS.has(field.key) ||
          value === undefined ||
          value === "" ||
          value.length === 14,
        "الرقم القومي يجب أن يتكون من 14 رقم",
      );
  }

  return baseSchema;
};

export const buildProfileCompletionSchema = (fields: DynamicProfileField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    if (!field.enabled || !SUPPORTED_FIELD_TYPES.has(field.type)) return;
    if (field.key === "avatar") return;

    if (field.type === "phone") {
      shape[field.key] = field.required ? phoneSchema : optionalPhoneSchema;
      return;
    }

    if (field.type === "profile_attachments" || field.type === "file") {
      const maxFiles = field.max_files ?? 2;
      const maxSizeMb = field.max_size_mb ?? 10;
      const maxSizeBytes = maxSizeMb * 1024 * 1024;
      const acceptedMimePrefixes = (field.accept ?? []).map((rule) =>
        rule.replace("*", ""),
      );

      const attachmentEntrySchema = z
        .object({
          id: z.number().optional(),
          file: z.instanceof(File).optional(),
        })
        .refine((entry) => entry.id !== undefined || entry.file !== undefined, {
          message: "الملف غير صالح",
        })
        .refine((entry) => {
          if (!entry.file) return true;
          if (!acceptedMimePrefixes.length) return true;
          return acceptedMimePrefixes.some((prefix) =>
            entry.file!.type.startsWith(prefix),
          );
        }, "نوع الملف غير مدعوم")
        .refine(
          (entry) => !entry.file || entry.file.size <= maxSizeBytes,
          `حجم الملف يجب ألا يتجاوز ${maxSizeMb}MB`,
        );

      shape[field.key] = field.required
        ? z
            .array(attachmentEntrySchema)
            .min(1, `الرجاء رفع ${field.label} هنا`)
            .max(maxFiles, `الحد الأقصى ${maxFiles} ملفات`)
        : z
            .array(attachmentEntrySchema)
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
        : z.preprocess((value) => {
            if (value === null || value === undefined || value === "") {
              return undefined;
            }
            return String(value);
          }, z.string().optional());
      return;
    }

    if (field.type === "email") {
      shape[field.key] = field.required
        ? z.preprocess(
            toRequiredTrimmedString,
            z
              .string()
              .min(1, `${field.label} مطلوب`)
              .email("بريد إلكتروني غير صالح"),
          )
        : z.preprocess((value) => {
            if (value === null || value === undefined || value === "") {
              return undefined;
            }
            return String(value).trim();
          }, z.string().email("بريد إلكتروني غير صالح").optional());
      return;
    }

    if (field.type === "date") {
      shape[field.key] = field.required
        ? z.preprocess(
            toRequiredTrimmedString,
            z
              .string()
              .min(1, `${field.label} مطلوب`)
              .refine(
                (value) => !Number.isNaN(Date.parse(value)),
                "تاريخ غير صالح",
              )
              .refine(
                (value) => new Date(value) <= new Date(),
                "تاريخ الميلاد لا يمكن أن يكون في المستقبل",
              ),
          )
        : z.preprocess((value) => {
            if (value === null || value === undefined || value === "") {
              return undefined;
            }
            return String(value).trim();
          },
          z
            .string()
            .refine(
              (value) => Number.isNaN(Date.parse(value)) === false,
              "تاريخ غير صالح",
            )
            .refine(
              (value) => new Date(value) <= new Date(),
              "تاريخ الميلاد لا يمكن أن يكون في المستقبل",
            )
            .optional());
      return;
    }

    shape[field.key] = buildTextLikeSchema(field);
  });

  return z.object(shape);
};

type ProfileFieldStep = DynamicProfileField[];
type ProfileFieldUnit = DynamicProfileField[];

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

const buildProfileFieldUnits = (
  fields: DynamicProfileField[],
): ProfileFieldUnit[] => {
  const normalized = ensureStateCityPaired(fields);
  const units: ProfileFieldUnit[] = [];

  for (let index = 0; index < normalized.length; index += 1) {
    const currentField = normalized[index];
    const nextField = normalized[index + 1];

    if (
      currentField?.key === "state_id" &&
      nextField?.key === "city_id"
    ) {
      units.push([currentField, nextField]);
      index += 1;
      continue;
    }

    units.push([currentField]);
  }

  return units;
};

export const buildProfileCompletionSteps = (
  fields: DynamicProfileField[],
): ProfileFieldStep[] => {
  const units = buildProfileFieldUnits(fields);
  const total = units.length;

  if (total === 0) return [];
  if (total < 8) return [units.flat()];

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

  const steps: ProfileFieldUnit[][] = [];
  let start = 0;
  let remainingFields = total;

  for (let i = 0; i < stepCount; i++) {
    const remainingSteps = stepCount - i;
    const target = Math.ceil(remainingFields / remainingSteps);
    const maxEnd = total - (remainingSteps - 1) * minFieldsPerStep;
    const end = i === stepCount - 1 ? total : Math.min(start + target, maxEnd);

    steps.push(units.slice(start, end));
    remainingFields -= end - start;
    start = end;
  }

  for (let i = steps.length - 1; i > 0; i--) {
    const currentStepFieldsCount = steps[i].flat().length;

    if (currentStepFieldsCount <= 2) {
      steps[i - 1] = [...steps[i - 1], ...steps[i]];
      steps.splice(i, 1);
    }
  }

  return steps.map((step) => step.flat());
};
