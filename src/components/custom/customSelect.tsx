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
          <FormItem className={`form-item w-full   ${className}`}>
            <FormLabel className="form-label">{label}</FormLabel>
            <div className="flex flex-col w-full flex-1 mt-1">
              <FormControl>
                <Select
                  dir="rtl"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full gap-2 flex   border-gray-light">
                    {iconSrc && <img className="ml-2" src={iconSrc} />}
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-9999999 text-black">
                    {options.map((option) => (
                      <>
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-black"
                        >
                          {option.label}
                        </SelectItem>
                      </>
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
