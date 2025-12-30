import Image from "next/image";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  iconSrc?: string;
  options: { value: string; label: string }[];
};

const CustomSelect = ({
  control,
  name,
  label,
  placeholder = `اختر ${label}`,
  className,
  iconSrc,
  options,
}: Props) => {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={`form-item w-full ${className}`}>
            <FormLabel className="form-label">{label}</FormLabel>
            <div className="mt-1 flex w-full flex-1 flex-col">
              <FormControl>
                <Select
                  dir="rtl"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="border-gray-light flex w-full gap-2">
                    {iconSrc && (
                      <Image
                        className="ml-2"
                        width={20}
                        height={20}
                        src={iconSrc}
                        alt=""
                      />
                    )}
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className="z-9999999 bg-white text-black">
                    {options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-black"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default CustomSelect;

{
  /* <FormField
control={control}
name={name}
render={({ field }) => (
  <FormItem>
    <FormLabel>Role</FormLabel>
    <FormControl>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/> */
}
