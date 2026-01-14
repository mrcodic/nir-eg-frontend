"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | number | { value: string | number; label: string } | null;
  label: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
  onSelect: (option: { value: string | number; label: string }) => void;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  labelClassName?: string;
};

export function ComboboxForm({
  open,
  setOpen,
  value,
  label,
  placeholder,
  options,
  onSelect,
  error,
  labelClassName,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <p
          className={cn(
            "text-sm",
            {
              "text-red-500": error,
            },
            labelClassName,
          )}
        >
          {label}
        </p>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="border-gray-light flex w-full flex-col items-start justify-between rounded-lg border px-3"
          >
            <div className="flex h-10 w-full items-center justify-between gap-4">
              {(value &&
                (typeof value === "object"
                  ? value.label
                  : options.find((f) => String(f.value) == String(value))
                      ?.label)) ||
                `اختر ${label}`}
              <ChevronsUpDown className="opacity-50" />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {typeof error === "string" ? error : error?.message?.toString()}
              </p>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="z-99 w-[330px] p-0 xl:w-[600px]">
          <Command>
            <CommandInput
              placeholder={placeholder || `اختر ${label}`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>لا يوجد</CommandEmpty>
              <CommandGroup>
                {options?.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.label}
                    onSelect={() => {
                      setOpen(false);
                      onSelect(framework);
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        String(
                          value && typeof value === "object"
                            ? value.value
                            : value,
                        ) == String(framework.value)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
