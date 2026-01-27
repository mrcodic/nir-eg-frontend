"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { ImageCropDialog } from "@/components/ImageCropDialog";

interface FileUploadProps {
  label: string;
  accept?: Accept | string;
  maxSize?: number; // in MB
  value?: File | null;
  onChange: (file: File | null) => void;
  previewUrl?: string;
  aspect?: number;
  isInvalid?: boolean;
}

// Default accept configuration
const DEFAULT_ACCEPT: Accept = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"],
};

export default function FileUpload({
  label,
  accept,
  maxSize = 5,
  value,
  onChange,
  previewUrl: externalPreviewUrl,
  aspect,
  isInvalid,
}: FileUploadProps) {
  const [cropOpen, setCropOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    externalPreviewUrl || null,
  );
  const [error, setError] = useState<string | null>(null);

  // Convert string accept to Accept object
  const acceptConfig = useMemo<Accept>(() => {
    if (!accept) return DEFAULT_ACCEPT;
    if (typeof accept === "string") {
      // Handle common patterns like "image/*"
      return { [accept]: [] };
    }
    return accept;
  }, [accept]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);

      // Handle rejections
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const errorCode = rejection.errors[0]?.code;

        if (errorCode === "file-too-large") {
          setError(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجابايت`);
        } else if (errorCode === "file-invalid-type") {
          setError("يرجى اختيار ملف صورة فقط");
        } else {
          setError("حدث خطأ أثناء رفع الملف");
        }
        return;
      }

      // Handle accepted file
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);

        setTempImage(url);
        setCropOpen(true);
      }
    },
    [maxSize],
  );

  const handleCroppedImage = useCallback(
    (file: File) => {
      if (previewUrl && !externalPreviewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file);
    },
    [previewUrl, externalPreviewUrl, onChange],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (previewUrl && !externalPreviewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setError(null);
      onChange(null);
    },
    [previewUrl, externalPreviewUrl, onChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptConfig,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div className="space-y-2">
      {tempImage && (
        <ImageCropDialog
          open={cropOpen}
          src={tempImage}
          onClose={() => {
            setCropOpen(false);
            URL.revokeObjectURL(tempImage);
            setTempImage(null);
          }}
          onConfirm={handleCroppedImage}
          aspect={aspect}
        />
      )}

      <label
        className={cn(
          "block text-sm font-medium text-right",
          isInvalid && "text-destructive",
        )}
      >
        {label}
      </label>

      <div
        {...getRootProps({
          className: cn(
            "relative flex flex-col items-center justify-center",
            "w-full h-40 border-2 border-dashed rounded-lg",
            "cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-primary-800 bg-primary-100/20"
              : "border-gray-light hover:border-primary-800/50",
            error && "border-destructive",
            isInvalid && "border-destructive",
          ),
        })}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative w-full h-full p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- Using blob URL from createObjectURL which is not compatible with next/image */}
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-md"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 left-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload
              className={cn(
                "w-8 h-8 mb-2 transition-colors",
                isDragActive ? "text-primary-800" : "text-gray-dark",
              )}
            />
            <p
              className={cn(
                "text-sm text-center transition-colors",
                isDragActive ? "text-primary-800" : "text-gray-dark",
              )}
            >
              {isDragActive ? "اترك الملف هنا..." : "اسحب الصورة واتركها هنا"}
            </p>
            <p className="text-xs text-gray-dark/60 mt-1">أو</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              <ImageIcon className="w-4 h-4 ml-2" />
              اختر صورة
            </Button>
          </>
        )}
      </div>

      {error && <p className="text-sm text-destructive text-right">{error}</p>}

      {/* File info */}
      {value && !error && (
        <p className="text-xs text-gray-dark text-right">
          {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
}
