import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";

export interface GenericFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  children: ({
    field,
    formState,
  }: {
    field: ControllerRenderProps<T, Path<T>>;
    formState: UseFormStateReturn<T>;
  }) => React.ReactNode;
}

export interface CustomFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
}
