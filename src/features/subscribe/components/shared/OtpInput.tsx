"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Split value into array
  const valueArray = value.split("").slice(0, length);
  while (valueArray.length < length) {
    valueArray.push("");
  }

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Trigger onComplete when all digits are entered
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits

    const newValue = valueArray.slice();
    newValue[index] = digit.slice(-1); // Take only last character
    const newOtp = newValue.join("");
    onChange(newOtp);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValue = valueArray.slice();

      if (valueArray[index]) {
        // Clear current input
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        // Move to previous input and clear it
        newValue[index - 1] = "";
        onChange(newValue.join(""));
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (pastedData) {
      onChange(pastedData);
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      setActiveIndex(focusIndex);
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
    // Select input content on focus
    inputRefs.current[index]?.select();
  };

  return (
    <div className="flex items-center justify-center gap-3" dir="ltr">
      {valueArray.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-xl font-semibold",
            "border-2 rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-primary-800",
            activeIndex === index ? "border-primary-800" : "border-gray-light",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100",
            className
          )}
        />
      ))}
    </div>
  );
}
