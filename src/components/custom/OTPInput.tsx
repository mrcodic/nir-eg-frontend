"use client";

import { cn } from "@/lib/utils";
import { ClipboardEvent, useEffect, useRef, useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

type OTPInputProps<T extends FieldValues> = {
  length?: number;
  form: UseFormReturn<T>;
  name?: Path<T>;
};

export default function OTPInput<T extends FieldValues>({
  length = 5,
  form,
  name,
}: OTPInputProps<T>) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>(
    Array.from({ length }, () => null)
  );
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(""));
  const isPastingRef = useRef(false);

  const hasError = !!form.formState.errors[name || "code"];

  useEffect(() => {
    form.setValue(
      name || ("code" as Path<T>),
      otpValues.join("") as PathValue<T, Path<T>>
    );
  }, [otpValues, form, name]);

  const handleChange = (index: number, value: string) => {
    if (isPastingRef.current) return;
    if (!/^[0-9]?$/.test(value)) return;

    setOtpValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });

    if (value && index < length - 1) {
      // Focus next input after state update
      setTimeout(() => {
        inputsRef.current[index + 1]?.focus();
        // Ensure cursor is at the end
        inputsRef.current[index + 1]?.setSelectionRange(1, 1);
      }, 0);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        e.preventDefault();
        setOtpValues((prev) => {
          const newValues = [...prev];
          newValues[index - 1] = ""; // Clear the previous input
          return newValues;
        });

        setTimeout(() => {
          inputsRef.current[index - 1]?.focus();
          inputsRef.current[index - 1]?.setSelectionRange(1, 1);
        }, 0);
      } else if (otpValues[index]) {
        // If current input has value, clear it but keep focus
        e.preventDefault();
        setOtpValues((prev) => {
          const newValues = [...prev];
          newValues[index] = "";
          return newValues;
        });
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      setTimeout(() => {
        inputsRef.current[index - 1]?.focus();
        inputsRef.current[index - 1]?.setSelectionRange(1, 1);
      }, 0);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      setTimeout(() => {
        inputsRef.current[index + 1]?.focus();
        inputsRef.current[index + 1]?.setSelectionRange(1, 1);
      }, 0);
    } else if (e.key === "Delete" && index < length - 1) {
      e.preventDefault();
      setOtpValues((prev) => {
        const newValues = [...prev];
        newValues[index + 1] = "";
        return newValues;
      });
    }
  };

  const handleOnPaste = (
    e: ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    isPastingRef.current = true;

    const pasteData = e.clipboardData.getData("text/plain").replace(/\D/g, "");

    let newOtpValues = [...pasteData].slice(0, length);

    if (newOtpValues.length < length) {
      newOtpValues = newOtpValues.concat(
        Array(length - newOtpValues.length).fill("")
      );
    }

    setOtpValues(newOtpValues);

    // Focus the appropriate input after paste
    setTimeout(() => {
      if (pasteData.length < length) {
        inputsRef.current[pasteData.length]?.focus();
        inputsRef.current[pasteData.length]?.setSelectionRange(1, 1);
      } else {
        inputsRef.current[length - 1]?.focus();
        inputsRef.current[length - 1]?.setSelectionRange(1, 1);
      }
      isPastingRef.current = false;
    }, 0);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select the content and move cursor to end when focused
    setTimeout(() => {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }, 0);
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Move cursor to end when clicked
    setTimeout(() => {
      e.currentTarget?.setSelectionRange(
        e.currentTarget.value.length,
        e.currentTarget.value.length
      );
    }, 0);
  };

  return (
    <div
      className="flex gap-2 lg:gap-6 justify-center"
      dir="ltr"
      style={{ direction: "ltr" }}
    >
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "relative flex caret-black! text-2xl pointer-events-auto size-10 lg:size-12 cursor-pointer items-center justify-center border border-gray-light transition-all has-[input:focus-within]:border-gray-dark rounded-lg",
            hasError &&
              (otpValues[index] === "" || !isFinite(Number(otpValues[index])))
              ? "border-red-500 has-[input:focus-within]:border-red-500"
              : ""
          )}
        >
          <input
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otpValues[index]}
            className="w-full flex justify-center outline-hidden text-center"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handleOnPaste(e, index)}
            onFocus={handleFocus}
            onClick={handleClick}
          />
        </div>
      ))}
    </div>
  );
}
