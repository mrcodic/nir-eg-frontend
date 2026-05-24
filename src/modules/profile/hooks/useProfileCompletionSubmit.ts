"use client";

import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { mapApiErrorsToForm } from "@/helpers/form-errors";
import { ProfileCompletionValues } from "@/helpers/profile-completion.helpers";
import { completeStudentProfile } from "@/services/auth.service";
import { DynamicProfileField } from "@/types/auth.types";

// ── Constants ───────────────────────────────────────────────────────────────

const NUMERIC_FIELDS = new Set(["state_id", "city_id", "student_type"]);
const FALLBACK_ERROR_MESSAGE = "حدث خطأ أثناء استكمال البيانات";

// ── Pure helpers ────────────────────────────────────────────────────────────

function buildSubmitPayload(
  fields: DynamicProfileField[],
  values: ProfileCompletionValues,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = values[field.key];
    if (raw === "" || raw === null || raw === undefined) continue;

    if (field.type === "phone" && typeof raw === "object" && raw !== null) {
      const phone = (raw as { phone?: string }).phone;
      if (phone) payload[field.key] = phone;
      continue;
    }

    payload[field.key] = NUMERIC_FIELDS.has(field.key) ? Number(raw) : raw;
  }

  return payload;
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
  queryClient: QueryClient;
  onServerFieldError: (fieldKey?: string) => void;
  onSuccess: () => void;
  onErrorToast: (message: string) => void;
};

// ── Hook ────────────────────────────────────────────────────────────────────

export function useProfileCompletionSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async ({
    values,
    fields,
    form,
    queryClient,
    onServerFieldError,
    onSuccess,
    onErrorToast,
  }: SubmitParams): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const payload = buildSubmitPayload(fields, values);
      await completeStudentProfile(payload);
      await queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
      onSuccess();
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

      onErrorToast(extractApiErrorMessage(error) || FALLBACK_ERROR_MESSAGE);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submit };
}
