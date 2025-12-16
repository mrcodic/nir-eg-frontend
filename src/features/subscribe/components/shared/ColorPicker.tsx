"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value: string; // "H S% L%"
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/* ===== component ===== */

export default function ColorPicker({
  value,
  onChange,
  label,
  className,
}: ColorPickerProps) {
  const [hex, setHex] = useState(value);

  // Debounced external onChange
  const debouncedOnChange = useMemo(
    () =>
      debounce((hexValue: string) => {
        onChange(hexValue);
      }, 200),
    [onChange]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const handleChange = (newHex: string) => {
    if (newHex === hex) return;

    setHex(newHex);
    debouncedOnChange(newHex);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <HexColorPicker
        color={hex}
        onChange={handleChange}
        className="w-full! rounded-lg h-[120px]!"
      />
    </div>
  );
}
