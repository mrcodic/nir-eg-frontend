"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomSelect from "@/components/custom/customSelect";
import ProfileAttachmentsField from "@/components/custom/ProfileAttachmentsField";
import { FALLBACK_STUDENT_TYPE_OPTIONS } from "@/helpers/profile-completion.helpers";
import { DynamicProfileField } from "@/types/auth.types";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

type Props<TValues extends Record<string, unknown>> = {
  form: UseFormReturn<TValues>;
  fields: DynamicProfileField[];
};

/** Fields that occupy a full row on their own — never candidates for the odd-last rule */
const isFullWidthField = (field: DynamicProfileField) =>
  field.key === "state_id" ||
  field.key === "city_id" ||
  field.type === "phone" ||
  field.type === "profile_attachments" ||
  field.type === "file";

export default function ProfileCompletionFields<
  TValues extends Record<string, unknown>,
>({ form, fields }: Props<TValues>) {
  const firstCityStateIndex = useMemo(
    () =>
      fields.findIndex(
        (field) => field.key === "state_id" || field.key === "city_id",
      ),
    [fields],
  );

  const oddLastKeys = useMemo(() => {
    const result = new Set<string>();
    let run: string[] = [];

    const flush = (isFinal: boolean) => {
      if (!isFinal && run.length % 2 !== 0) {
        result.add(run[run.length - 1]);
      }
      run = [];
    };

    fields.forEach((field) => {
      if (isFullWidthField(field)) {
        flush(false);
      } else {
        run.push(field.key);
      }
    });

    flush(true);
    return result;
  }, [fields]);

  return (
    <>
      {fields.map((field, index) => {
        // ── city / state pair ──────────────────────────────────────────────
        if (field.key === "state_id" || field.key === "city_id") {
          if (index !== firstCityStateIndex) return null;
          return (
            <div
              key="state-city-pair"
              className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <CustomCityStateField form={form} />
            </div>
          );
        }

        // ── phone ──────────────────────────────────────────────────────────
        if (field.type === "phone") {
          return (
            <CustomPhoneInput
              key={field.key}
              name={`${field.key}.phone`}
              form={form}
              label={field.label}
              countryFieldName={`${field.key}.country`}
              countryISOFieldName={`${field.key}.country_iso`}
              className="col-span-2"
            />
          );
        }

        // ── attachments / file ─────────────────────────────────────────────
        if (field.type === "profile_attachments" || field.type === "file") {
          return (
            <ProfileAttachmentsField
              key={field.key}
              form={form}
              name={field.key}
              label={field.label}
              field={field}
            />
          );
        }

        // ── single-column fields (selects + inputs) ────────────────────────
        const colClass = oddLastKeys.has(field.key) ? "col-span-2" : undefined;

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
              className={colClass}
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
              className={colClass}
            />
          );
        }

        return (
          <CustomInput
            key={field.key}
            control={form.control}
            name={field.key}
            label={field.label}
            className={colClass}
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
    </>
  );
}
