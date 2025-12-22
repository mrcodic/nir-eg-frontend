import { getPublicData } from "@/config/client-fetch";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import GenericField from "./GenericField";

export interface SelectOption {
  id: number | string;
  name: string;
}

interface CustomSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  queryKey?: string;
  placeholder?: string;
  options?: SelectOption[];
  disabled?: boolean;
  triggerClassName?: string;
  onAfterSelect?: (value?: string) => void;
}

function CustomSelect<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  queryKey,
  disabled,
  triggerClassName,
  onAfterSelect,
}: CustomSelectProps<T>) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: getPublicData as () => Promise<{ data: SelectOption[] }>,
    enabled: !!queryKey && !disabled,
  });

  const queryOptions = data?.data || [];

  return (
    <GenericField form={form} name={name} label={label}>
      {({ field, formState }) => (
        <Select
          key={queryOptions?.length ? "loaded" : "loading"}
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value);
            onAfterSelect?.(value);
          }}
          disabled={disabled || isLoading}
        >
          <SelectTrigger
            aria-invalid={formState.errors[name] ? true : undefined}
            className={cn("w-full", triggerClassName)}
          >
            <SelectValue placeholder={placeholder || `اختر ${label}`} />
          </SelectTrigger>

          <SelectContent>
            {isLoading ? (
              <span className="text-right animate-pulse py-1.5 pr-8 pl-2 text-sm">
                ....جاري التحميل
              </span>
            ) : (
              (options || queryOptions)?.map((option) => (
                <SelectItem key={option.id} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}
    </GenericField>
  );
}

export default CustomSelect;
