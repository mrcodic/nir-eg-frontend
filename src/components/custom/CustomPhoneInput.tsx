"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";
import CustomCountryFlagField from "./CustomCountryFlagField";

interface CustomPhoneInputProps {
  name: string;
  form: UseFormReturn<any>;
  placeholder?: string;
  className?: string;
  label?: string;
  iconSrc?: string;
  info?: string;
  countryFieldName?: string;
  countryISOFieldName?: string;
  onCountryChange?: (code: string, iso: string) => void;
  disabled?: boolean;
}

const CustomPhoneInput = ({
  name,
  form,
  placeholder,
  className,
  label,
  iconSrc,
  info,
  countryFieldName = "country",
  countryISOFieldName = "country_iso",
  disabled,
  onCountryChange,
}: CustomPhoneInputProps) => {
  //   const [selectedCountry, setSelectedCountry] = useState<Country | null>(
  //     arabCountries[1]
  //   );

  //   const { data: countriesData, isLoading } = useQuery({
  //     queryKey: [`/dial-codes/list`],
  //     queryFn: getClientPrivateData,
  //   });

  //   const countries: Country[] = countriesData?.data || [];

  console.log(form.getValues());

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("relative w-full", label ? "mt-4" : "", className)}
        >
          {label && (
            <FormLabel
              htmlFor={name}
              className="text-gray-dark mb-2 flex cursor-text gap-4 font-medium transition-all"
            >
              {iconSrc && <img src={iconSrc} alt="icon" className="size-5" />}

              {label}
            </FormLabel>
          )}

          <div className="relative">
            <div className="relative flex items-center gap-2">
              <CustomCountryFlagField
                form={form}
                countryFieldName={countryFieldName}
                countryISOFieldName={countryISOFieldName}
                onCountryChange={onCountryChange}
                disabled={disabled}
              />

              {/* Icon */}
              {/* {iconSrc && (
                  <img src={iconSrc} alt="icon" className="w-5 h-5 mr-3" />
                )} */}

              <FormControl>
                <Input
                  placeholder={placeholder || "رقم الهاتف"}
                  className="text-end"
                  {...field}
                  onChange={(e) => {
                    // only allow digits
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(value);
                  }}
                  id={name}
                  value={field.value}
                  disabled={disabled}
                  dir="ltr"
                />
              </FormControl>
            </div>

            {info && (
              <p className="text-primary-800 mt-1 mr-2 text-xs">{info}</p>
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default memo(CustomPhoneInput);
