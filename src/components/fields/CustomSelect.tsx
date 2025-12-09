import { cn } from "@/lib/utils";
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
  value: string;
  label: string;
}

interface CustomSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  triggerClassName?: string;
}

function CustomSelect<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  disabled,
  triggerClassName,
}: CustomSelectProps<T>) {
  return (
    <GenericField form={form} name={name} label={label}>
      {({ field }) => (
        <Select
          value={field.value}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger className={cn("w-full", triggerClassName)}>
            <SelectValue placeholder={placeholder || `اختر ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </GenericField>
  );
}

export default CustomSelect;
