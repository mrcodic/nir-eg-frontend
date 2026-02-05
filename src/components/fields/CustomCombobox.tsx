"use client";

import { getPublicData } from "@/config/client-fetch";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import GenericField from "./GenericField";

interface CustomComboboxProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  queryKey?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options?: SelectOption[];
  disabled?: boolean;
  triggerClassName?: string;
  onAfterSelect?: (value?: string) => void;
  fetchOnMount?: boolean;
}

function CustomCombobox<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  searchPlaceholder = "ابحث...",
  emptyText = "لا توجد نتائج",
  options,
  queryKey,
  disabled,
  triggerClassName,
  onAfterSelect,
  fetchOnMount = true,
}: CustomComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: getPublicData as () => Promise<{ data: SelectOption[] }>,
    enabled: !!queryKey && !disabled && (fetchOnMount || open),
  });

  const queryOptions = data?.data || [];
  const finalOptions = options || queryOptions;

  const filteredOptions = useMemo(
    () =>
      finalOptions.filter((option) =>
        option.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [finalOptions, searchValue],
  );

  return (
    <GenericField form={form} name={name} label={label}>
      {({ field, formState }) => {
        const selectedOption = finalOptions.find(
          (option) => String(option.id) === String(field.value),
        );

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline-gray"
                role="combobox"
                aria-expanded={open}
                aria-invalid={formState.errors[name] ? true : undefined}
                disabled={disabled || isLoading}
                className={cn(
                  "w-full h-11 justify-between font-normal",
                  !selectedOption && "text-muted-foreground",
                  triggerClassName,
                )}
              >
                {isLoading ? (
                  <span className="text-muted-foreground">جاري التحميل...</span>
                ) : (
                  <span className="truncate">
                    {selectedOption?.name || placeholder || `اختر ${label}`}
                  </span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>
                    {isLoading ? "...جاري التحميل" : emptyText}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => {
                      const isSelected =
                        String(option.id) === String(field.value);

                      return (
                        <CommandItem
                          key={option.id}
                          value={String(option.id)}
                          onSelect={(currentValue) => {
                            const newValue =
                              currentValue === String(field.value)
                                ? ""
                                : currentValue;

                            field.onChange(newValue);
                            onAfterSelect?.(newValue);
                            setOpen(false);
                            setSearchValue("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {option.name}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    </GenericField>
  );
}

export default CustomCombobox;
