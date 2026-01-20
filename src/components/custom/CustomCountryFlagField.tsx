"use client";

import { FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { arabCountries } from "@/constants/arabCountries";
import { useMemo, useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { UseFormReturn, useWatch } from "react-hook-form";

interface Props {
  form: UseFormReturn<any>;
  countryFieldName: string;
  countryISOFieldName: string;
  onCountryChange?: (code: string, iso?: string) => void;
  disabled?: boolean;
}

export default function CustomCountryFlagField({
  form,
  countryFieldName,
  countryISOFieldName,
  onCountryChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedCountryCode = useWatch({
    control: form.control,
    name: countryFieldName,
  });

  /**
   * Build lookup map once (O(1) access)
   */
  const countriesByCode = useMemo(
    () => new Map(arabCountries.map((c) => [c.countryCallingCodes?.[0], c])),
    [],
  );

  const selectedCountry = selectedCountryCode
    ? countriesByCode.get(selectedCountryCode)
    : undefined;

  return (
    <FormField
      control={form.control}
      name={countryFieldName}
      render={({ field }) => (
        <FormItem className="h-11">
          <Select
            disabled={disabled}
            value={field.value}
            onOpenChange={setOpen}
            onValueChange={(value) => {
              const country = countriesByCode.get(value);

              if (country) {
                form.setValue(countryISOFieldName, country.alpha2, {
                  shouldValidate: true,
                });
                form.setValue(
                  countryFieldName,
                  country.countryCallingCodes?.[0],
                  {
                    shouldValidate: true,
                  },
                );
              }

              onCountryChange?.(value, country?.alpha2);
            }}
          >
            {/* ===== Trigger ===== */}
            <SelectTrigger
              title="اختر الدولة"
              dir="rtl"
              className="border-gray-light h-11 w-[85px] rounded-lg border bg-[#F5F5F5] px-1 py-1 text-sm font-medium text-[#121212] [&>div]:mx-auto [&>div]:truncate"
            >
              <SelectValue placeholder="اختر الدولة">
                {selectedCountry ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 overflow-hidden rounded-full">
                      <CircleFlag
                        countryCode={selectedCountry.alpha2.toLowerCase()}
                        height={20}
                      />
                    </div>
                    {selectedCountry.countryCallingCodes?.[0].replace("+", "")}+
                  </div>
                ) : (
                  "اختر الدولة"
                )}
              </SelectValue>
            </SelectTrigger>

            {/* ===== Content ===== */}
            <SelectContent dir="rtl">
              <p className="text-muted-foreground mr-2 text-xs">اختر الدولة</p>

              {open &&
                arabCountries.map((country) => (
                  <SelectItem
                    key={country.countryCallingCodes?.[0]}
                    value={country.countryCallingCodes?.[0]}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 overflow-hidden rounded-full">
                        <CircleFlag
                          countryCode={country.alpha2.toLowerCase()}
                          height={20}
                        />
                      </div>
                      <span>
                        {country.arabicName} (
                        {country.countryCallingCodes?.[0].replace("+", "")}
                        +)
                      </span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
