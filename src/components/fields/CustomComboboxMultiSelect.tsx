"use client";

import { getPublicData } from "@/config/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
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
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  id: string;
  name: string;
}

interface CustomComboboxMultiSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  queryKey: string;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  triggerClassName?: string;
}

function CustomComboboxMultiSelect<T extends FieldValues>({
  form,
  name,
  queryKey,
  label,
  placeholder = "اختر عنصر...",
  searchPlaceholder = "ابحث...",
  emptyText = "لا توجد نتائج",
  triggerClassName,
}: CustomComboboxMultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [options, searchValue],
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const values = (field.value as string[]) || [];

        // const filteredOptions = options.filter((option) =>
        //   option.name.toLowerCase().includes(searchValue.toLowerCase()),
        // );

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline-gray"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "justify-between h-11 font-normal",
                    !values.length && "text-muted-foreground",
                    triggerClassName,
                  )}
                >
                  {placeholder || `اختر ${label}`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
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
                        const isSelected = values.includes(option.id);
                        return (
                          <CommandItem
                            key={option.id}
                            value={option.id}
                            onSelect={() => {
                              if (isSelected) {
                                field.onChange(
                                  values.filter((v) => v !== option.id),
                                );
                              } else {
                                field.onChange([...values, option.id]);
                              }
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

            {/* Selected tags */}
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.map((selectedValue) => {
                  const option = options.find((o) => o.id === selectedValue);
                  return (
                    <span
                      key={selectedValue}
                      className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary-100 text-primary-800 rounded-md"
                    >
                      {option?.name}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(
                            values.filter((v) => v !== selectedValue),
                          );
                        }}
                        className="hover:text-destructive ml-1 size-3 flex items-center justify-center text-lg cursor-pointer"
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

export default CustomComboboxMultiSelect;
