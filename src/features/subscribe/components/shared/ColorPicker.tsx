"use client";

import { PREDEFINED_COLORS } from "@/constants/template";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function ColorPicker({
  value,
  onChange,
  label,
}: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-3">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-3">
        {PREDEFINED_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "size-10 rounded-full flex items-center justify-center transition-all",
              "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-800",
              value === color
                ? "ring-2 ring-offset-1 ring-primary-800 scale-110"
                : "border border-gray-200"
            )}
            style={{ backgroundColor: `hsl(${color})` }}
            aria-label={`Select color ${color}`}
          >
            {value === color && (
              <Check className="w-5 h-5 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
