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

const CustomSelect = ({
  control,
  name,
  label,
  placeholder = `select a ${label}`,
  className,
  iconSrc,
  options,
}) => {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={`form-item space-y-0 w-full   ${className}`}>
            <FormLabel className="form-label">{label}</FormLabel>
            <div className="flex flex-col w-full p-2 flex-1 border-primary-700 border-b items-center text-gray-dark relative  ">
              <FormControl>
                <Select
                  dir="rtl border-none focus:border-none"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full gap-2 flex  border-none  outline-hidden focus:outline-hidden">
                    <img className="ml-2" src={iconSrc} />
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

              <FormMessage className="form-message " />
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
