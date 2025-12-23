"use client";

import { getPublicData } from "@/config/client-fetch";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import GenericField from "./GenericField";

const VirtualizedContent = dynamic(() => import("./VirtualizedContent"), {
  ssr: false,
});

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
  fetchOnMount?: boolean;
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
  fetchOnMount = true,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: getPublicData as () => Promise<{ data: SelectOption[] }>,
    enabled: !!queryKey && !disabled && (fetchOnMount || open),
  });

  const queryOptions = data?.data || [];
  const finalOptions = options || queryOptions;

  const needVirtualized = finalOptions.length > 10;

  return (
    <GenericField form={form} name={name} label={label}>
      {({ field, formState }) => {
        const selectedOption = needVirtualized
          ? finalOptions.find(
              (option) => String(option.id) === String(field.value)
            )
          : null;

        return (
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              onAfterSelect?.(value);
            }}
            onOpenChange={setOpen}
            open={open}
            disabled={disabled || isLoading}
          >
            <SelectTrigger
              aria-invalid={formState.errors[name] ? true : undefined}
              className={cn("w-full", triggerClassName)}
            >
              {isLoading ? (
                <span className="text-muted-foreground">جاري التحميل...</span>
              ) : needVirtualized ? (
                <span
                  className={cn(!selectedOption && "text-muted-foreground")}
                >
                  {selectedOption?.name || placeholder || `اختر ${label}`}
                </span>
              ) : (
                <SelectValue placeholder={placeholder || `اختر ${label}`} />
              )}
            </SelectTrigger>

            <SelectContent className="max-h-60 overflow-auto">
              {isLoading ? (
                <p className="text-right w-full animate-pulse py-1.5 pr-2 text-sm">
                  ....جاري التحميل
                </p>
              ) : needVirtualized ? (
                <VirtualizedContent options={finalOptions} />
              ) : (
                finalOptions?.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        );
      }}
    </GenericField>
  );
}

export default CustomSelect;
