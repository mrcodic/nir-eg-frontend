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
};

const CustomSelect = ({
  control,
  name,
  label,
  placeholder = `اختر ${label}`,
  className,
  iconSrc,
  options,
  isLoading,
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={`form-item w-full ${className}`}>
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="mt-1 flex w-full flex-1 flex-col">
            <FormControl>
              <Select
                dir="rtl"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger
                  aria-invalid={!!fieldState.error}
                  className="border-gray-light flex w-full cursor-pointer gap-2 text-sm transition-all hover:bg-neutral-100 aria-invalid:border-red-500"
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
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="z-9999999 bg-white text-black">
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
                    <div className="ps-2 text-sm text-black">
                      لا يوجد خيارات
                    </div>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default memo(CustomSelect);
