"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type CustomRadioOption = {
  label: string;
  value: string;
};

type CustomRadioGroupProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  disabled?: boolean;
  options: CustomRadioOption[];
};

function CustomRadioGroup<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  options,
}: CustomRadioGroupProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              dir="rtl"
              value={String(field.value ?? "")}
              onValueChange={field.onChange}
              disabled={disabled}
              className="grid grid-cols-2 gap-3"
            >
              {options.map((option) => {
                const optionId = `${name}-${option.value}`;

                return (
                  <Label
                    key={option.value}
                    htmlFor={optionId}
                    className="bg-primary-50/50 text-primary-800/50 has-[[data-state=checked]]:border-primary-800 has-[[data-state=checked]]:bg-primary-50 has-[[data-state=checked]]:text-primary-800 flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold transition-all"
                  >
                    <RadioGroupItem
                      id={optionId}
                      value={option.value}
                      className="invisible size-0"
                    />
                    {option.label}
                  </Label>
                );
              })}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomRadioGroup;
