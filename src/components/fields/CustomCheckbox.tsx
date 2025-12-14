import { FieldValues } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { CustomFieldProps } from "./fields.types";

function CustomCheckbox<T extends FieldValues>({
  form,
  name,
  label,
}: Omit<CustomFieldProps<T>, "placeholder">) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-3 ">
          <FormControl>
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="flex flex-wrap gap-2 items-center">
            <Label className="text-sm cursor-pointer" htmlFor={name}>
              {label}
            </Label>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

export default CustomCheckbox;
