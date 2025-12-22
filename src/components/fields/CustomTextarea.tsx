import type { ComponentProps } from "react";
import type { FieldValues } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import GenericField from "./GenericField";
import type { CustomFieldProps } from "./fields.types";

type FieldProps = Omit<ComponentProps<typeof Textarea>, "form">;

function CustomTextarea<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  ...props
}: FieldProps & CustomFieldProps<T>) {
  return (
    <GenericField form={form} name={name} label={label}>
      {({ field }) => (
        <Textarea
          {...props}
          {...field}
          placeholder={placeholder || `قم بإدخال ${label}`}
          rows={5}
        />
      )}
    </GenericField>
  );
}

export default CustomTextarea;
