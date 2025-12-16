"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value: string; // "H S% L%"
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/* ===== utils ===== */

const hslToHex = (hsl: string) => {
  const [h, s, l] = hsl.replace(/%/g, "").split(" ").map(Number);
  if ([h, s, l].some(Number.isNaN)) return "#000000";

  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

/* ===== component ===== */

export default function ColorPicker({
  value,
  onChange,
  label,
  className,
}: ColorPickerProps) {
  const [hex, setHex] = useState(() => hslToHex(value));
  const isInternalChange = useRef(false);

  // Debounced external onChange
  const debouncedOnChange = useMemo(
    () =>
      debounce((hexValue: string) => {
        onChange(hexToHsl(hexValue));
      }, 200),
    [onChange]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  // Sync external value (form reset, etc.)
  const handleValueChange = useEffectEvent(() => {
    const nextHex = hslToHex(value);
    if (nextHex !== hex) {
      setHex(nextHex);
    }
  });

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    handleValueChange();
  }, [value]); // intentionally exclude `hex`

  const handleChange = (newHex: string) => {
    if (newHex === hex) return;

    isInternalChange.current = true;
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
