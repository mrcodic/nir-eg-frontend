"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { arabCountries } from "@/constants/arabCountries";
import { cn } from "@/lib/utils";
import { CircleFlag } from "react-circle-flags";
import { UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";

interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  ioc: string;
  languages: string[];
  name: string;
  arabicName: string;
  status: string;
}
// interface Country {
//   iso2: string;
//   label: string;
//   code: string;
//   time_zone: string;
//   short_code: string;
// }

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

  const formSelectedCountryCode = form.watch(countryFieldName);

  const selectedCountry = arabCountries.find(
    (c) => c.countryCallingCodes?.[0] === formSelectedCountryCode
  );
  //   const { data: countriesData, isLoading } = useQuery({
  //     queryKey: [`/dial-codes/list`],
  //     queryFn: getClientPrivateData,
  //   });

  //   const countries: Country[] = countriesData?.data || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("w-full relative", label ? "mt-4" : "", className)}
        >
          {label && (
            <FormLabel
              htmlFor={name}
              className="flex mb-2 gap-4  font-medium cursor-text  transition-all text-gray-dark "
            >
              {iconSrc && <img src={iconSrc} alt="icon" className="size-5" />}

              {label}
            </FormLabel>
          )}

          <div className="relative">
            <div className="flex items-center gap-2 relative">
              <FormField
                control={form.control}
                name={countryFieldName}
                render={({ field: countryField }) => (
                  <FormItem className="h-10">
                    <Select
                      disabled={disabled}
                      onValueChange={(value) => {
                        const currentCountry = arabCountries.find(
                          (c) => c.countryCallingCodes?.[0] === value
                        );

                        countryField.onChange(value);

                        if (currentCountry) {
                          // Use setValue from the form
                          form.setValue(
                            countryISOFieldName,
                            currentCountry.alpha2,
                            {
                              shouldValidate: true,
                            }
                          );
                        }

                        onCountryChange?.(value, currentCountry?.alpha2);
                      }}
                      value={countryField.value}
                    >
                      <SelectTrigger
                        title="اختر الدولة"
                        className="px-1 py-1 bg-[#F5F5F5] border-l border-[#D9D9D9] text-sm font-medium text-[#121212] w-[85px] h-full border-0 rounded-none [&>div]:truncate [&>div]:mx-auto"
                        dir="rtl"
                      >
                        <SelectValue placeholder="اختر الدولة">
                          {selectedCountry ? (
                            <div className="flex items-center gap-2">
                              <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                                <CircleFlag
                                  countryCode={selectedCountry.alpha2.toLowerCase()}
                                  height={20}
                                />
                              </div>
                              {selectedCountry.countryCallingCodes?.[0].replace(
                                "+",
                                ""
                              ) + "+"}
                            </div>
                          ) : (
                            "اختر الدولة"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <p className="text-[12px] text-[#666] mt-1 mr-2">
                          اختر الدولة
                        </p>
                        {arabCountries.map((country) => (
                          <SelectItem
                            key={country.countryCallingCodes?.[0]}
                            value={country.countryCallingCodes?.[0]}
                          >
                            <div className="flex items-center gap-2">
                              <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                                <CircleFlag
                                  countryCode={country.alpha2.toLowerCase()}
                                  height={20}
                                />
                              </div>
                              <span>
                                {country.arabicName} (
                                {country.countryCallingCodes?.[0].replace(
                                  "+",
                                  ""
                                )}
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
              <p className="text-sm text-primary-800 mt-1 mr-2">{info}</p>
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomPhoneInput;
