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

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | number | null;
  label: string;
  placeholder?: string;
  frameworks: { value: string | number; label: string }[];
  onSelect: (framework: { value: string | number; label: string }) => void;
  error?: string | null;
  labelClassName?: string;
};

export function ComboboxForm({
  open,
  setOpen,
  value,
  label,
  placeholder,
  frameworks,
  onSelect,
  error,
  labelClassName,
}: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <p className={cn("text-sm", labelClassName)}>{label}</p>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-full flex flex-col justify-between px-3   items-start border border-gray-light rounded-lg"
          >
            <div className="flex items-center h-10  justify-between w-full gap-4">
              {(value &&
                (typeof value === "object"
                  ? value.label
                  : frameworks.find((f) => String(f.value) == String(value))
                      ?.label)) ||
                `اختر ${label}`}
              <ChevronsUpDown className="opacity-50" />
            </div>
            {error && <p className="text-red-500 text-sm">{error?.message}</p>}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="z-9999999! w-[330px] xl:w-[600px] p-0">
          <Command>
            <CommandInput
              placeholder={placeholder || `اختر ${label}`}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>لا يوجد</CommandEmpty>
              <CommandGroup>
                {frameworks?.map((framework) => (
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
                            : value
                        ) == String(framework.value)
                          ? "opacity-100"
                          : "opacity-0"
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
