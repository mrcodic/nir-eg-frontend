"use client";

import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  DynamicProfileField,
  ExistingProfileAttachment,
  ProfileAttachmentEntry,
} from "@/types/auth.types";
import { Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
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
  "too-many-files": "تم تجاوز الحد الأقصى للملفات",
  "file-too-large": "حجم الملف كبير جدًا",
};

const isExistingAttachment = (
  value: unknown,
): value is ExistingProfileAttachment =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof (value as { id?: unknown }).id === "number";

const isProfileAttachmentEntry = (
  value: unknown,
): value is ProfileAttachmentEntry =>
  typeof value === "object" &&
  value !== null &&
  ("id" in value || "file" in value);

const normalizeEntries = (value: unknown): ProfileAttachmentEntry[] => {
  if (!Array.isArray(value)) return [];
  const normalized: ProfileAttachmentEntry[] = [];
  value.forEach((entry) => {
    if (isProfileAttachmentEntry(entry)) {
      normalized.push({
        id: entry.id,
        file: entry.file,
        url: entry.url,
        name: entry.name,
        file_name: entry.file_name,
      });
      return;
    }
    if (isExistingAttachment(entry)) {
      normalized.push({
        id: entry.id,
        url: entry.url,
        name: entry.name,
        file_name: entry.file_name,
      });
    }
  });
  return normalized;
};

export default function ProfileAttachmentsField<
  TValues extends Record<string, unknown>,
>({ form, name, label, field }: Props<TValues>) {
  const controller = useController({
    control: form.control,
    name: name as UseControllerProps<TValues>["name"],
  });

  const entries = useMemo(
    () => normalizeEntries(controller.field.value),
    [controller.field.value],
  );

  // ✅ Memoize derived arrays so downstream memos don't invalidate every render
  const existingEntries = useMemo(
    () =>
      entries.filter((e) => e.id !== undefined && !(e.file instanceof File)),
    [entries],
  );

  const sessionEntries = useMemo(
    () => entries.filter((e) => e.file instanceof File),
    [entries],
  );

  const replacementQueueRef = useRef<number[]>([]);

  const maxFiles = field?.max_files ?? 2;
  const maxSizeMb = field?.max_size_mb ?? 10;
  const maxSizeBytes = maxSizeMb * 1024 * 1024;
  const reachedMaxFiles = entries.length >= maxFiles;

  // ✅ Memoize accepts — prevents useDropzone from re-initializing on every render
  const acceptList = field?.accept;

  const accepts = useMemo(() => {
    if (acceptList?.length) {
      return Object.fromEntries(acceptList.map((mime) => [mime, []]));
    }

    return {
      "image/*": [],
      "application/pdf": [],
    };
  }, [acceptList]);

  // ✅ Stable callbacks prevent useDropzone from re-initializing
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const available = Math.max(0, maxFiles - entries.length);
      const nextFiles = acceptedFiles
        .slice(0, available)
        .map((selectedFile) => {
          const replaceId = replacementQueueRef.current.shift();
          return replaceId !== undefined
            ? { id: replaceId, file: selectedFile }
            : { file: selectedFile };
        });
      controller.field.onChange([...entries, ...nextFiles]);
      form.clearErrors(name as UseControllerProps<TValues>["name"]);
    },
    [entries, maxFiles, controller.field, form, name],
  );

  const handleDropRejected = useCallback(
    (rejections: FileRejection[]) => {
      const firstErrorCode = rejections?.[0]?.errors?.[0]?.code;
      const message =
        (firstErrorCode && DROPZONE_ERROR_MAP[firstErrorCode]) ||
        "تعذر رفع الملف، تأكد من النوع والعدد";
      form.setError(name as UseControllerProps<TValues>["name"], {
        type: "manual",
        message,
      });
    },
    [form, name],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    maxFiles,
    maxSize: maxSizeBytes,
    disabled: reachedMaxFiles,
    noClick: true,
    noKeyboard: true,
    accept: accepts,
  });

  // ✅ Now safe: sessionEntries is memoized, so this only reruns when files actually change
  const previews = useMemo(
    () =>
      sessionEntries.map((entry) => ({
        entry,
        src:
          entry.file && entry.file.type.startsWith("image/")
            ? URL.createObjectURL(entry.file)
            : null,
      })),
    [sessionEntries],
  );

  // ✅ Revoke only removed URLs — not the full list on every change
  const prevPreviewsRef = useRef(previews);
  useEffect(() => {
    const prev = prevPreviewsRef.current;
    const currentSrcs = new Set(previews.map((p) => p.src).filter(Boolean));

    prev.forEach(({ src }) => {
      if (src && !currentSrcs.has(src)) {
        URL.revokeObjectURL(src);
      }
    });

    prevPreviewsRef.current = previews;

    return () => {
      // Revoke all on unmount
      previews.forEach(({ src }) => {
        if (src) URL.revokeObjectURL(src);
      });
    };
  }, [previews]);

  // ✅ Stable reference — prevents re-renders in mapped children
  const removeEntryAt = useCallback(
    (index: number) => {
      const target = entries[index];
      if (target?.id !== undefined) {
        replacementQueueRef.current.push(target.id);
      }
      controller.field.onChange(entries.filter((_, i) => i !== index));
    },
    [entries, controller.field],
  );

  return (
    <FormItem className="col-span-2 my-2">
      <div className="flex flex-col items-start gap-6 sm:flex-row">
        <input {...getInputProps()} />

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

        <div className="flex flex-1 flex-col gap-2">
          <FormLabel aria-invalid={!!controller.fieldState.error?.message}>
            {label}
          </FormLabel>

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

          {existingEntries.length > 0 && (
            <p className="text-muted-foreground text-xs">ملفات مرفوعة مسبقًا</p>
          )}
          <div className="flex flex-wrap gap-2">
            {existingEntries.map((entry) => {
              const idx = entries.findIndex((item) => item === entry);
              const fileName =
                entry.name || entry.file_name || `File #${entry.id ?? "-"}`;

              return (
                <div
                  key={`existing-${entry.id ?? fileName}`}
                  className="border-muted bg-muted/30 flex items-center gap-2 rounded-md border p-1 pe-2"
                >
                  <p className="max-w-40 truncate text-xs">{fileName}</p>
                  {entry.url && (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-800 text-xs underline"
                    >
                      تنزيل
                    </a>
                  )}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeEntryAt(idx)}
                    aria-label={`remove-existing-${entry.id ?? fileName}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {sessionEntries.length > 0 && (
            <p className="text-muted-foreground text-xs">
              ملفات مضافة في الجلسة الحالية
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {previews.map(({ entry, src }) => {
              const file = entry.file as File;
              const idx = entries.findIndex((item) => item === entry);

              return (
                <div
                  key={`session-${file.name}-${idx}`}
                  className="border-muted bg-muted/30 flex items-center gap-2 rounded-md border p-1 pe-2"
                >
                  {src ? (
                    <img
                      src={src}
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
                    onClick={() => removeEntryAt(idx)}
                    aria-label={`remove-session-${file.name}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <FormMessage>{controller.fieldState.error?.message}</FormMessage>
    </FormItem>
  );
}
