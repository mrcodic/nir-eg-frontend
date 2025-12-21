import { cn } from "@/lib/utils";
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
  labelClassName,
}: GenericFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, formState }) => (
        <FormItem>
          <FormLabel className={cn("text-sm text-right", labelClassName)}>
            {label}
          </FormLabel>
          <FormControl>{children({ field, formState })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default GenericField;
