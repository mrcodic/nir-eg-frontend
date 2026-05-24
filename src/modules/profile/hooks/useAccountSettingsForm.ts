"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useAuthContext } from "@/context/auth-context";
import { mapApiErrorsToForm } from "@/helpers/form-errors";
import { mutateClient } from "@/helpers/post-client";
import { buildProfileCompletionDefaults } from "@/helpers/profile-completion.helpers";
import { useToast } from "@/hooks/use-toast";
import { buildAccountSettingsSchema } from "@/lib/account-settings.schema";
import { getPhoneInfoFromCode } from "@/lib/utils";
import { fetchStudentProfileSettingsFields } from "@/services/auth.service";
import { useRouter } from "next/navigation";

type AccountSettingsValues = Record<string, unknown> & {
  first_name: string;
  last_name: string;
  parent_phone?: { country?: string; country_iso?: string; phone?: string };
  state_id?: number | string;
  city_id?: number | string;
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

  const settingsFieldsQuery = useQuery({
    queryKey: ["/students/profile/setting"],
    queryFn: fetchStudentProfileSettingsFields,
  });

  const dynamicFields = useMemo(
    () =>
      (settingsFieldsQuery.data?.data?.fields ?? []).filter(
        (field) => field.enabled,
      ),
    [settingsFieldsQuery.data?.data?.fields],
  );

  const dynamicDefaults = useMemo(
    () => buildProfileCompletionDefaults(dynamicFields, null),
    [dynamicFields],
  );

  const phoneInfo = getPhoneInfoFromCode(profile?.code_country);

  const defaultValues = useMemo<AccountSettingsValues>(
    () => ({
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      parent_phone: {
        country: phoneInfo?.code || "",
        country_iso: phoneInfo?.isoCode || "",
        phone: profile?.parent_phone || "",
      },
      state_id: profile?.state_id ?? "",
      city_id: profile?.city_id ?? "",
      center_id: profile?.center_id ?? "",
      avatar: null,
      old_password: "",
      password: "",
      password_confirmation: "",
      ...dynamicDefaults,
    }),
    [dynamicDefaults, phoneInfo?.code, phoneInfo?.isoCode, profile],
  );

  const dynamicFieldKeys = useMemo(
    () => new Set(dynamicFields.map((field) => field.key)),
    [dynamicFields],
  );

  const schema = useMemo(() => {
    return buildAccountSettingsSchema({ dynamicFields, dynamicFieldKeys });
  }, [dynamicFieldKeys, dynamicFields]);

  const form = useForm<AccountSettingsValues>({
    defaultValues,
    values: defaultValues,
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

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

        if (key === "avatar" && rawValue instanceof File) {
          formData.append("avatar", rawValue);
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
        await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        await queryClient.invalidateQueries({
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
    dynamicFieldKeys,
    isFieldsLoading: settingsFieldsQuery.isLoading,
  };
}
