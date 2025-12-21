import { getPublicData } from "@/config/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
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
  id: string;
  name: string;
}

interface CustomMultiSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  queryKey: string;
  label: string;
  placeholder?: string;
  triggerClassName?: string;
}

function CustomMultiSelect<T extends FieldValues>({
  form,
  name,
  queryKey,
  label,
  placeholder,
  triggerClassName,
}: CustomMultiSelectProps<T>) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: getPublicData as () => Promise<{ data: MultiSelectOption[] }>,
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((option) => ({
        id: String(option.id),
        name: option.name,
      })) || []
    );
  }, [data]);

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
                {isLoading && (
                  <span className="text-right animate-pulse py-1.5 pr-8 pl-2 text-sm">
                    ....جاري التحميل
                  </span>
                )}

                {options.map((option) => (
                  <SelectItem
                    key={`${queryKey}-${option.id}`}
                    value={option.id}
                  >
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Selected tags */}
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.map((selectedValue) => {
                  const option = options.find((o) => o.id == selectedValue);
                  return (
                    <span
                      key={selectedValue}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
                    >
                      {option?.name}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(
                            values.filter((v) => v != selectedValue)
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
