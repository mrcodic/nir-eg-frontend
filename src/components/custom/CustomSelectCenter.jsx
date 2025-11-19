"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

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

const frameworks = [
  { value: 1, label: "القاهرة" },
  { value: 2, label: "الإسكندرية" },
  { value: 3, label: "الجيزة" },
  { value: 4, label: "الدقهلية" },
  { value: 5, label: "البحر الأحمر" },
  { value: 6, label: "البحيرة" },
  { value: 7, label: "الفيوم" },
  { value: 8, label: "الغربية" },
  { value: 9, label: "الإسماعيلية" },
  { value: 10, label: "المنوفية" },
  { value: 11, label: "المنيا" },
  { value: 12, label: "القليوبية" },
  { value: 13, label: "الوادي الجديد" },
  { value: 14, label: "السويس" },
  { value: 15, label: "أسوان" },
  { value: 16, label: "أسيوط" },
  { value: 17, label: "بني سويف" },
  { value: 18, label: "بورسعيد" },
  { value: 19, label: "دمياط" },
  { value: 20, label: "الشرقية" },
  { value: 21, label: "جنوب سيناء" },
  { value: 22, label: "كفر الشيخ" },
  { value: 23, label: "مطروح" },
  { value: 24, label: "الأقصر" },
  { value: 25, label: "قنا" },
  { value: 26, label: "شمال سيناء" },
  { value: 27, label: "سوهاج" },
];

export function CustomSelectCenter({ set, state, name }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (state) {
      setValue(Number(state));
    }
  }, [state]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-b border-primary-700! text-custom-brown rounded-none h-10"
        >
          {value
            ? frameworks.find((framework) => framework.value == value)?.label
            : "أختر المحافظة"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[330px] p-0">
        <Command>
          <CommandInput placeholder="بحث عن المحافظة" className="h-9" />
          <CommandList>
            <CommandEmpty>لا يوجد</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={value}
                  name={name}
                  // Use the label for search filtering
                  onSelect={() => {
                    setValue(framework.value);
                    set(name, framework.value); // Store the numeric value
                    setOpen(false);
                  }}
                >
                  {framework.label} {/* Display label correctly */}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
