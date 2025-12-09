import { FieldValues, Path, UseFormReturn } from "react-hook-form";
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

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface CustomMultiSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  options: MultiSelectOption[];
  placeholder?: string;
  triggerClassName?: string;
}

function CustomMultiSelect<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder,
  triggerClassName,
}: CustomMultiSelectProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const values = (field.value as string[]) || [];

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={(value) => {
                if (!values.includes(value)) {
                  field.onChange([...values, value]);
                }
              }}
            >
              <FormControl>
                <SelectTrigger className={triggerClassName}>
                  <SelectValue placeholder={placeholder || `اختر ${label}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Selected tags */}
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.map((selectedValue) => {
                  const option = options.find((o) => o.value === selectedValue);
                  return (
                    <span
                      key={selectedValue}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
                    >
                      {option?.label}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(
                            values.filter((v) => v !== selectedValue)
                          );
                        }}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default CustomMultiSelect;
