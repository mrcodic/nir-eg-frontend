"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomSelect from "@/components/custom/customSelect";
import { DynamicProfileField } from "@/types/auth.types";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { FALLBACK_STUDENT_TYPE_OPTIONS } from "../../../helpers/profile-completion.helpers";

type Props<TValues extends Record<string, unknown>> = {
  form: UseFormReturn<TValues>;
  fields: DynamicProfileField[];
};

export default function ProfileCompletionFields<
  TValues extends Record<string, unknown>,
>({ form, fields }: Props<TValues>) {
  const shouldRenderCityState = useMemo(
    () =>
      fields.some(
        (field) => field.key === "state_id" || field.key === "city_id",
      ),
    [fields],
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        if (field.key === "state_id" || field.key === "city_id") return null;

        if (field.key === "student_type") {
          const options =
            field.options?.map((opt) => ({
              value: String(opt.value),
              label: opt.label,
            })) ?? FALLBACK_STUDENT_TYPE_OPTIONS;

          return (
            <CustomSelect
              key={field.key}
              control={form.control}
              name={field.key}
              label={field.label}
              options={options}
            />
          );
        }

        if (field.type === "select") {
          const options =
            field.options?.map((opt) => ({
              value: String(opt.value),
              label: opt.label,
            })) ?? [];
          return (
            <CustomSelect
              key={field.key}
              control={form.control}
              name={field.key}
              label={field.label}
              options={options}
            />
          );
        }

        if (field.type === "phone") {
          return (
            <CustomPhoneInput
              key={field.key}
              name={`${field.key}.phone`}
              form={form}
              label={field.label}
              countryFieldName={`${field.key}.country`}
              countryISOFieldName={`${field.key}.country_iso`}
            />
          );
        }

        return (
          <CustomInput
            key={field.key}
            control={form.control}
            name={field.key}
            label={field.label}
            type={
              field.type === "email"
                ? "email"
                : field.type === "date"
                  ? "date"
                  : "text"
            }
          />
        );
      })}

      {shouldRenderCityState && <CustomCityStateField form={form} />}
    </div>
  );
}
