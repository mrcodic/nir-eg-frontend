"use client";

import ProfileCompletionFields from "@/modules/profile/components/ProfileCompletionFields";
import { DynamicProfileField } from "@/types/auth.types";
import { UseFormReturn } from "react-hook-form";

type Props<TValues extends Record<string, unknown>> = {
  form: UseFormReturn<TValues>;
  fields: DynamicProfileField[];
};

export default function AccountSettingsDynamicFields<
  TValues extends Record<string, unknown>,
>({ form, fields }: Props<TValues>) {
  if (!fields.length) return null;

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-lg font-bold">بيانات إضافية</h2>
      <div className="mt-6">
        <ProfileCompletionFields form={form} fields={fields} />
      </div>
    </div>
  );
}
