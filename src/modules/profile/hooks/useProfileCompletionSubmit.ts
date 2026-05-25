"use client";

import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { mapApiErrorsToForm } from "@/helpers/form-errors";
import { ProfileCompletionValues } from "@/helpers/profile-completion.helpers";
import { useToast } from "@/hooks/use-toast";
import { completeStudentProfile } from "@/services/auth.service";
import {
  DynamicProfileField,
  ProfileAttachmentEntry,
} from "@/types/auth.types";

// ── Constants ───────────────────────────────────────────────────────────────

const NUMERIC_FIELDS = new Set(["state_id", "city_id", "student_type"]);
const FALLBACK_ERROR_MESSAGE = "حدث خطأ أثناء استكمال البيانات";

// ── Pure helpers ────────────────────────────────────────────────────────────

function buildSubmitPayload(
  fields: DynamicProfileField[],
  values: ProfileCompletionValues,
): { payload: Record<string, unknown> | FormData; hasFiles: boolean } {
  const payload: Record<string, unknown> = {};
  const formData = new FormData();
  let hasFiles = false;

  for (const field of fields) {
    const raw = values[field.key];
    if (raw === "" || raw === null || raw === undefined) continue;

    if (field.type === "phone" && typeof raw === "object" && raw !== null) {
      const phone = (raw as { phone?: string }).phone;
      if (phone) payload[field.key] = phone;
      continue;
    }

    if (
      (field.type === "profile_attachments" || field.type === "file") &&
      Array.isArray(raw)
    ) {
      const attachments = raw.filter(
        (entry): entry is ProfileAttachmentEntry =>
          typeof entry === "object" &&
          entry !== null &&
          ("id" in entry || "file" in entry),
      );

      if (!attachments.length) continue;
      hasFiles = true;

      attachments.forEach((attachment, index) => {
        if (attachment.id !== undefined) {
          formData.append(`${field.key}[${index}][id]`, String(attachment.id));
        }

        if (attachment.file instanceof File) {
          formData.append(`${field.key}[${index}][file]`, attachment.file);
        }
      });
      continue;
    }

    payload[field.key] = NUMERIC_FIELDS.has(field.key) ? Number(raw) : raw;
  }

  if (hasFiles) {
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    return { payload: formData, hasFiles: true };
  }

  return { payload, hasFiles: false };
}

function buildPhoneFieldMap(
  fields: DynamicProfileField[],
): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [f.key, f.type === "phone" ? `${f.key}.phone` : f.key]),
  );
}

function extractApiErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) return "";
  const data = error.response?.data;
  return data?.message ?? data?.error?.message ?? "";
}

// ── Types ───────────────────────────────────────────────────────────────────

type SubmitParams = {
  values: ProfileCompletionValues;
  fields: DynamicProfileField[];
  form: UseFormReturn<ProfileCompletionValues>;
  onServerFieldError: (fieldKey?: string) => void;
  onSuccess: () => void;
};

// ── Hook ────────────────────────────────────────────────────────────────────

export function useProfileCompletionSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const submit = async ({
    values,
    fields,
    form,
    onServerFieldError,
    onSuccess,
  }: SubmitParams): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const payload = buildSubmitPayload(fields, values);
      await completeStudentProfile(payload.payload);

      queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
      queryClient.removeQueries({ queryKey: ["/students/profile/setting"] });

      onSuccess?.();

      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.errors) {
        const apiErrors = error.response.data.errors as Record<
          string,
          string[] | undefined
        >;
        mapApiErrorsToForm(apiErrors, form.setError, {
          fieldMap: buildPhoneFieldMap(fields),
        });
        onServerFieldError(Object.keys(apiErrors)[0]);
      }

      toast({
        description: extractApiErrorMessage(error) || FALLBACK_ERROR_MESSAGE,
        icon: "error",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submit };
}
