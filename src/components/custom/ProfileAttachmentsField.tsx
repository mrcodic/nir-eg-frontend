"use client";

import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DynamicProfileField } from "@/types/auth.types";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  UseControllerProps,
  UseFormReturn,
  useController,
} from "react-hook-form";

type Props<TValues extends Record<string, unknown>> = {
  form: UseFormReturn<TValues>;
  name: string;
  label: string;
  field?: DynamicProfileField;
};

const DROPZONE_ERROR_MAP: Record<string, string> = {
  "file-invalid-type": "الملف يجب أن يكون صورة أو PDF",
  "too-many-files": "الحد الأقصى 2 ملفات",
  "file-too-large": "حجم الملف كبير جدًا",
};

export default function ProfileAttachmentsField<
  TValues extends Record<string, unknown>,
>({ form, name, label, field }: Props<TValues>) {
  const controller = useController({
    control: form.control,
    name: name as UseControllerProps<TValues>["name"],
  });

  const currentFiles = Array.isArray(controller.field.value)
    ? (controller.field.value as File[])
    : [];

  const maxFiles = field?.max_files ?? 2;
  const maxSizeMb = field?.max_size_mb ?? 10;
  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  const reachedMaxFiles = currentFiles.length >= maxFiles;
  const accepts = field?.accept?.length
    ? Object.fromEntries(field.accept.map((mime) => [mime, []]))
    : { "image/*": [], "application/*": [] };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (accepted: File[]) => {
      const merged = [...currentFiles, ...accepted].slice(0, maxFiles);
      controller.field.onChange(merged);
      form.clearErrors(name as UseControllerProps<TValues>["name"]);
    },
    onDropRejected: (rejections) => {
      const firstErrorCode = rejections?.[0]?.errors?.[0]?.code;
      const message =
        (firstErrorCode && DROPZONE_ERROR_MAP[firstErrorCode]) ||
        "تعذر رفع الملف، تأكد من النوع والعدد";
      form.setError(name as UseControllerProps<TValues>["name"], {
        type: "manual",
        message,
      });
    },
    maxFiles,
    maxSize: maxSizeBytes,
    disabled: reachedMaxFiles,
    noClick: true,
    noKeyboard: true,
    accept: accepts,
  });

  const removeFileAt = (index: number) => {
    const next = currentFiles.filter((_, i) => i !== index);
    controller.field.onChange(next);
  };

  return (
    <FormItem className="col-span-2 my-2">
      <div className="flex flex-col-reverse items-start gap-6 sm:flex-row">
        <input {...getInputProps()} />

        <div className="flex flex-1 flex-col gap-2">
          <FormLabel>{label}</FormLabel>

          {!reachedMaxFiles ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="bg-primary-50 border-primary-800 text-primary-800"
                onClick={open}
              >
                اختر ملف
              </Button>
              <p className="text-muted-foreground text-xs">
                قم بتحميل ملفاتك (JPG, PNG, PDF) بحد أقصى {maxFiles} ملفات
              </p>
            </>
          ) : (
            <p className="text-primary-800 text-xs">
              تم الوصول إلى الحد الأقصى للملفات. احذف ملفًا لإضافة ملف جديد.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {currentFiles.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="border-muted bg-muted/30 flex items-center gap-2 rounded-md border p-1 pe-2"
                >
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="size-8 rounded object-cover"
                    />
                  ) : (
                    <div className="bg-primary-50 text-primary-800 rounded px-2 py-1 text-xs">
                      PDF
                    </div>
                  )}
                  <p className="max-w-40 truncate text-xs">{file.name}</p>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeFileAt(index)}
                    aria-label={`remove-${file.name}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {!reachedMaxFiles && (
          <div
            {...getRootProps()}
            className="border-muted-foreground/30 hover:bg-muted/20 flex size-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-2 transition-colors max-sm:w-full"
            onClick={open}
          >
            <div className="bg-primary-50 text-primary-800 rounded-md p-2">
              <Upload className="size-4" />
            </div>
            <p className="text-muted-foreground text-center text-xs">
              يمكنك وضع الملفات هنا لرفعها
            </p>
          </div>
        )}
      </div>
      <FormMessage>{controller.fieldState.error?.message}</FormMessage>
    </FormItem>
  );
}
