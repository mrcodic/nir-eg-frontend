"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useAuthContext } from "@/context/auth-context";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { mapApiErrorsToForm } from "@/helpers/form-errors";
import { buildProfileCompletionDefaults } from "@/helpers/profile-completion.helpers";
import { sortDynamicProfileFields } from "@/helpers/profile-fields-order";
import { useToast } from "@/hooks/use-toast";
import { buildAccountSettingsSchema } from "@/lib/account-settings.schema";
import { getPhoneInfoFromCode } from "@/lib/utils";
import { fetchStudentProfileSettingsFields } from "@/services/auth.service";
import { ProfileAttachmentEntry } from "@/types/auth.types";
import { useRouter } from "next/navigation";

type AccountSettingsValues = Record<string, unknown> & {
  first_name?: string;
  phone?: { country?: string; country_iso?: string; phone?: string };
  center_id?: number | string;
  avatar?: File | null;
  old_password?: string;
  password?: string;
  password_confirmation?: string;
};

const PROFILE_QUERY_KEY = ["/students/profile"];
const NUMERIC_KEYS = new Set(["state_id", "city_id", "student_type"]);

const toStringSafe = (value: unknown): string => String(value ?? "");

export function useAccountSettingsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setIsChangePassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const phoneInfo = getPhoneInfoFromCode(profile?.code_country);

  const settingsFieldsQuery = useQuery({
    queryKey: ["/students/profile/setting"],
    queryFn: fetchStudentProfileSettingsFields,
  });

  const dynamicFields = useMemo(() => {
    const fields = (settingsFieldsQuery.data?.data?.fields ?? []).filter(
      (field) => field.enabled,
    );
    return sortDynamicProfileFields(fields, {
      excludeKeys: ["first_name", "phone", "grade_id", "avatar"],
    });
  }, [settingsFieldsQuery.data?.data?.fields]);

  // ✅ Schema built once when fields arrive, stable empty schema before that
  const schema = useMemo(() => {
    return buildAccountSettingsSchema({ dynamicFields });
  }, [dynamicFields]);

  // ✅ defaultValues only includes dynamic fields when they're actually ready
  const defaultValues = useMemo<AccountSettingsValues>(() => {
    const base: AccountSettingsValues = {
      first_name: profile?.first_name ?? "",
      phone: {
        country: phoneInfo?.code || "",
        country_iso: phoneInfo?.isoCode || "",
        phone: profile?.phone || "",
      },
      center_id: profile?.center_id ?? null,
      avatar: null,
      old_password: "",
      password: "",
      password_confirmation: "",
    };

    if (dynamicFields.length === 0) return base;

    const dynamicDefaults = buildProfileCompletionDefaults(
      dynamicFields,
      (profile as unknown as Record<string, unknown> | null) ?? null,
    );

    return { ...base, ...dynamicDefaults };
  }, [dynamicFields, phoneInfo?.code, phoneInfo?.isoCode, profile]);

  const form = useForm<AccountSettingsValues>({
    mode: "onBlur",
    resolver: zodResolver(schema),
    defaultValues,
  });

  // ✅ Reset once when dynamic fields + profile are both ready
  // Uses settingsFieldsQuery.isSuccess to guarantee data exists
  useEffect(() => {
    if (
      !settingsFieldsQuery.isSuccess ||
      dynamicFields.length === 0 ||
      !profile
    )
      return;
    form.reset(defaultValues);
  }, [
    settingsFieldsQuery.isSuccess,
    dynamicFields,
    profile,
    form,
    defaultValues,
  ]);

  const submit = form.handleSubmit(async (values) => {
    if (changePassword) {
      if (
        !values.password ||
        !values.password_confirmation ||
        !values.old_password
      ) {
        const message = "يرجى إدخال جميع حقول كلمة المرور";
        toast({ description: message, icon: "error" });
        form.setError("old_password", { type: "manual", message });
        form.setError("password", { type: "manual", message });
        form.setError("password_confirmation", { type: "manual", message });
        return;
      }
    }

    setIsSubmitting(true);
    form.clearErrors();

    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, rawValue]) => {
        if (rawValue === undefined || rawValue === null || rawValue === "")
          return;

        if (key === "center_id") {
          const hasExistingCenter =
            profile?.center_id !== null && profile?.center_id !== undefined;
          if (
            profile?.type !== 3 ||
            hasExistingCenter ||
            values?.student_type != 3
          )
            return;
        }

        if (key === "avatar" && rawValue instanceof File) {
          formData.append("avatar", rawValue);
          return;
        }

        const fileDynamicField = dynamicFields.find(
          (field) =>
            field.key === key &&
            (field.type === "profile_attachments" || field.type === "file"),
        );

        if (fileDynamicField && Array.isArray(rawValue)) {
          const attachments = rawValue.filter(
            (entry): entry is ProfileAttachmentEntry =>
              typeof entry === "object" &&
              entry !== null &&
              ("id" in entry || "file" in entry),
          );

          attachments.forEach((attachment, index) => {
            if (attachment.id !== undefined) {
              formData.append(`${key}[${index}][id]`, String(attachment.id));
            }
            if (attachment.file instanceof File) {
              formData.append(`${key}[${index}][file]`, attachment.file);
            }
          });
          return;
        }

        if (typeof rawValue === "object" && rawValue !== null) {
          const dynamicPhoneField = dynamicFields.find(
            (field) => field.key === key && field.type === "phone",
          );
          if (dynamicPhoneField) {
            const phone = (rawValue as { phone?: string }).phone;
            if (phone) formData.append(key, phone);
            return;
          }

          if (key === "parent_phone") {
            const phone = (rawValue as { phone?: string }).phone;
            const country = (rawValue as { country?: string }).country;
            const countryIso = (rawValue as { country_iso?: string })
              .country_iso;
            if (phone) formData.append("parent_phone", phone);
            if (country) formData.append("country", country);
            if (countryIso) formData.append("country_iso", countryIso);
          }

          if (key === "phone") {
            const phone = (rawValue as { phone?: string }).phone;
            const country = (rawValue as { country?: string }).country;
            const countryIso = (rawValue as { country_iso?: string })
              .country_iso;
            if (phone) formData.append("phone", phone);
            if (country) formData.append("country", country);
            if (countryIso) formData.append("country_iso", countryIso);
          }

          return;
        }

        formData.append(
          key,
          NUMERIC_KEYS.has(key)
            ? toStringSafe(Number(rawValue))
            : toStringSafe(rawValue),
        );
      });

      const response = await mutateClient("/students/profile/edit", {
        body: formData,
        auth: true,
      });

      if (response?.code === 200) {
        toast({ description: "تم حفظ التغييرات بنجاح", icon: "success" });

        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: ["/students/profile/setting"],
        });

        setIsChangePassword(false);
        setSelectedFile(null);

        form.reset();
        router.refresh();
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.data?.errors) {
        mapApiErrorsToForm(
          error.response.data.errors as Record<string, string[]>,
          (name, err) =>
            form.setError(name as keyof AccountSettingsValues, {
              type: "manual",
              message: err.message,
            }),
          {
            fieldMap: Object.fromEntries(
              dynamicFields.map((field) => [
                field.key,
                field.type === "phone" ? `${field.key}.phone` : field.key,
              ]),
            ),
          },
        );
      }

      const message = isAxiosError(error)
        ? (error.response?.data?.message ??
          error.response?.data?.error?.message ??
          "حدث خطأ ما")
        : "حدث خطأ ما";
      toast({ description: message, icon: "error" });
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    profile,
    form,
    submit,
    isSubmitting,
    selectedFile,
    setSelectedFile,
    changePassword,
    setIsChangePassword,
    dynamicFields,
    isFieldsLoading: settingsFieldsQuery.isLoading,
  };
}
