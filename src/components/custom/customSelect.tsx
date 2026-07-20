import { Loader2 } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  iconSrc?: string;
  options: { value: string; label: string }[];
  isLoading?: boolean;
  disabled?: boolean;
};

const CustomSelect = ({
  control,
  name,
  label,
  placeholder,
  className,
  iconSrc,
  options,
  isLoading,
  disabled,
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`form-item w-full ${className}`}>
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="mt-1 flex w-full flex-1 flex-col">
            <Select
              dir="rtl"
              onValueChange={field.onChange}
              value={field.value !== undefined ? String(field.value) : ""}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  disabled={disabled}
                  className="border-gray-light flex h-11 w-full cursor-pointer gap-2 text-sm shadow-xs transition-all hover:bg-neutral-100 disabled:hover:bg-white aria-invalid:border-red-500"
                >
                  {iconSrc && (
                    <Image
                      className="ml-2"
                      width={20}
                      height={20}
                      src={iconSrc}
                      alt=""
                    />
                  )}
                  <SelectValue placeholder={placeholder || `اختر ${label}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="z-99999 bg-white text-black">
                {isLoading ? (
                  <div className="flex min-h-16 items-center justify-center">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                ) : options?.length ? (
                  options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-black"
                    >
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="ps-2 text-sm text-black">لا يوجد خيارات</div>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default memo(CustomSelect);
