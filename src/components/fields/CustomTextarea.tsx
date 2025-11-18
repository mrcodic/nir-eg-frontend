import { FieldValues } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import GenericField from "./GenericField";
import { CustomFieldProps } from "./fields.types";

function CustomTextarea<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: CustomFieldProps<T>) {
  return (
    <GenericField form={form} name={name} label={label}>
      {({ field }) => (
        <Textarea
          {...field}
          placeholder={placeholder || `قم بإدخال ${label}`}
          rows={5}
        />
      )}
    </GenericField>
  );
}

export default CustomTextarea;
