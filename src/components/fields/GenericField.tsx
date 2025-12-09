import { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { GenericFieldProps } from "./fields.types";

function GenericField<T extends FieldValues>({
  form,
  name,
  label,
  children,
}: GenericFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm text-right">{label}</FormLabel>
          <FormControl>{children({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default GenericField;
