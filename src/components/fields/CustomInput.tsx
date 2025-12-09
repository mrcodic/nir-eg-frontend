import { ComponentProps } from "react";
import { FieldValues } from "react-hook-form";
import { Input } from "../ui/input";
import GenericField from "./GenericField";
import { CustomFieldProps } from "./fields.types";

type FieldProps = Omit<ComponentProps<typeof Input>, "form">;

function CustomInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  ...props
}: FieldProps & CustomFieldProps<T>) {
  return (
    <GenericField form={form} name={name} label={label}>
      {({ field }) => (
        <Input
          {...props}
          {...field}
          placeholder={placeholder || `قم بإدخال ${label}`}
          {...(props?.type === "number"
            ? {
                onChange: (e) => field.onChange(Number(e.target.valueAsNumber)),
              }
            : {})}
        />
      )}
    </GenericField>
  );
}

export default CustomInput;
