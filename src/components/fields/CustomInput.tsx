import { FieldValues } from "react-hook-form";
import { Input } from "../ui/input";
import GenericField from "./GenericField";
import { CustomFieldProps } from "./fields.types";

function CustomInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: CustomFieldProps<T>) {
  return (
    <GenericField form={form} name={name} label={label}>
      {({ field }) => (
        <Input {...field} placeholder={placeholder || `قم بإدخال ${label}`} />
      )}
    </GenericField>
  );
}

export default CustomInput;
