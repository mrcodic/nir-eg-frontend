import Image from "next/image";
import { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { CustomFieldProps } from "./fields.types";

export interface RadioOption {
  value: string;
  label: string;
  icons?: string[];
  description?: string;
}

interface CustomRadioGroupProps<T extends FieldValues> extends Omit<
  CustomFieldProps<T>,
  "placeholder"
> {
  options: RadioOption[];
  direction?: "horizontal" | "vertical";
  onChangeExtra?: (value: string) => void;
}

function CustomRadioGroup<T extends FieldValues>({
  form,
  name,
  label,
  options,
  direction = "horizontal",
  onChangeExtra,
}: CustomRadioGroupProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                onChangeExtra?.(value);
              }}
              value={field.value}
              className={
                direction === "horizontal"
                  ? "flex gap-6 max-sm:flex-wrap"
                  : "flex flex-col gap-3"
              }
              dir="rtl"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex  flex-col w-full gap-6 cursor-pointer"
                >
                  <Label
                    htmlFor={option.value}
                    className={`flex min-h-14 w-full relative overflow-hidden cursor-pointer p-2.5  border-2 border-gray-light rounded-lg has-[button[data-state=checked]]:bg-primary-50 items-center gap-2 has-[button[data-state=checked]]:border-primary-800 `}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />

                    <div className="flex-col gap-2 flex">
                      <div className="flex items-center gap-2 flex-wrap-reverse">
                        {option?.icons && (
                          <div className="flex gap-2  ">
                            {option?.icons?.map((icon) => (
                              <div
                                key={icon}
                                className="h-8  relative flex items-center justify-center"
                              >
                                <Image
                                  src={icon}
                                  height={32}
                                  width={0}
                                  className="h-8 w-auto"
                                  alt="payment icon"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="flex gap-6 items-center sm:text-base text-xs">
                          <span className="font-bold">{option.label}</span>
                        </p>
                      </div>
                      {!!option?.description && (
                        <p className="text-muted-foreground text-sm">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomRadioGroup;
