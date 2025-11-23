import { useState } from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface CustomInputProps {
  control: Control<any>;
  name: string;
  label: string;
  className?: string;
  info?: string;
  type?: string;
  iconSrc?: string;
  onChange?: () => void;
  isPassword?: boolean; // Icon support
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  info,
  type = "text",
  className = "",
  iconSrc,
  isPassword,
  defaultValue,
  disabled,
}: CustomInputProps) => {
  const [changeHidePassword, setChangeHidePassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`w-full flex  flex-col relative ${className}`}>
          {/* Styled Input Container */}
          <div className=" relative">
            {/* <div className="p-2 flex items-center gap-2 border-b border-gray-light text-gray-dark"> */}
            <FormLabel
              htmlFor={name}
              className="flex text-gray-dark mb-2 gap-4  font-medium  cursor-text  "
            >
              {iconSrc && <img src={iconSrc} alt="icon" className="size-5" />}

              {label}
            </FormLabel>

            <FormControl>
              <Input
                type={changeHidePassword === false ? type : "text"}
                placeholder={placeholder || `ادخل ${label}`}
                className=""
                {...field}
                id={name}
                defaultValue={defaultValue}
                value={field.value}
                disabled={isPassword || disabled}
              />
            </FormControl>

            {type === "password" && (
              <img
                onClick={() => setChangeHidePassword(!changeHidePassword)}
                src={changeHidePassword ? "/assets/eye.svg" : "/assets/eye.svg"}
                alt="icon"
                className="size-5 cursor-pointer absolute bottom-3 left-3 "
              />
            )}
          </div>

          {info && (
            <label className="text-sm inline-block mt-2 font-normal text-primary-800">
              {info}
            </label>
          )}

          <FormMessage />
        </div>
      )}
    />
  );
};

export default CustomInput;
