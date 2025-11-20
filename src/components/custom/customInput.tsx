import { useState } from "react";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface CustomInputProps {
  control: Control<any>;
  name: string;
  placeholder: string;
  className?: string;
  info?: string;
  type?: string;
  iconSrc?: string;
  onChange?: () => void;
  isPassword?: boolean; // Icon support
  label?: string;
  defaultValue?: string;
  disabled?: boolean;
}

const CustomInput = ({
  control,
  name,
  placeholder,
  info,
  type = "text",
  className = "",
  iconSrc,
  onChange,
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
        <div className={`w-full flex  flex-col mt-12! relative ${className}`}>
          {/* Styled Input Container */}
          <div className=" relative">
            {/* <div className="p-2 flex items-center gap-2 border-b border-primary-700 text-gray-dark"> */}
            <FormControl>
              <Input
                type={changeHidePassword === false ? type : "text"}
                placeholder={""}
                className="text-sm  font-medium placeholder:text-gray-dark  text-gray-dark w-full border-none outline-hidden focus:border-none disabled:cursor-not-allowed disabled:opacity-70"
                {...field}
                id={name}
                defaultValue={defaultValue}
                value={field.value}
                disabled={isPassword || disabled}
              />
            </FormControl>

            <FormLabel
              htmlFor={name}
              className="flex text-custom-brown mb-2 text-sm gap-4 absolute font-medium -top-4 text-xs  right-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-custom-brown peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
            >
              {iconSrc && (
                <img src={iconSrc} alt="icon" className="w-[20px] h-[20px]" />
              )}

              {placeholder}
            </FormLabel>
            {type === "password" && (
              <img
                onClick={() => setChangeHidePassword(!changeHidePassword)}
                src={
                  changeHidePassword ? "/assets/eye.png" : "/assets/hide.png"
                }
                alt="icon"
                className="w-[20px] cursor-pointer absolute top-0 left-0 h-[20px]"
              />
            )}
          </div>
          {info && (
            <label className="text-[12px] inline-block mt-[8px] font-normal text-[#523412]">
              {info}
            </label>
          )}

          <FormMessage className="mt-1 text-red-500 text-sm absolute -bottom-6 " />
        </div>
      )}
    />
  );
};

export default CustomInput;
