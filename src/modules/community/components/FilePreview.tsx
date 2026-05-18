"use client";

import { cn } from "@/lib/utils";
import { FileText, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type PreviewFile = {
  file: File;
  /** object-URL for images, null for non-image files */
  objectUrl: string | null;
};

type FilePreviewProps = {
  files: File[];
  onChange: (files: File[]) => void;
  /** Extra class applied to the outer wrapper */
  className?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isImage(file: File) {
  return file.type.startsWith("image/");
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FilePreview({
  files,
  onChange,
  className,
}: FilePreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  // Build / revoke object-URLs whenever the file list changes
  useEffect(() => {
    const next: PreviewFile[] = files.map((file) => ({
      file,
      objectUrl: isImage(file) ? URL.createObjectURL(file) : null,
    }));
    setPreviews(next);

    return () => {
      next.forEach((p) => {
        if (p.objectUrl) URL.revokeObjectURL(p.objectUrl);
      });
    };
  }, [files]);

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files);
    onChange([...files, ...incoming]);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  if (files.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3",
        className,
      )}
      role="list"
      aria-label="Selected files"
    >
      {previews.map(({ file, objectUrl }, idx) => (
        <div
          key={`${file.name}-${idx}`}
          role="listitem"
          className="relative flex flex-col items-center gap-1"
        >
          {/* ── Remove button — sits on the wrapper, never clipped ─────── */}
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            aria-label={`Remove ${file.name}`}
            className="bg-destructive absolute -top-1.5 -right-1.5 z-10 flex size-5 cursor-pointer items-center justify-center rounded-full text-white shadow transition-all hover:bg-red-700"
          >
            <X className="size-3" />
          </button>

          {/* ── Thumbnail ─────────────────────────────────────────────── */}
          <div className="relative size-20 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {objectUrl ? (
              <Image
                src={objectUrl}
                alt={file.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              /* PDF / generic file */
              <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
                <FileText className="text-primary-700 size-8" />
                <span className="line-clamp-2 text-center text-[9px] font-medium text-gray-600">
                  {file.name}
                </span>
              </div>
            )}

            {/* ── size badge ──────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/30 px-1 py-0.5">
              <p className="truncate text-center text-[9px] text-white">
                {humanSize(file.size)}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* ── Add-more tile ─────────────────────────────────────────────────── */}
      <label
        className="border-primary-300 text-primary-600 hover:bg-primary-50 flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed bg-white transition-colors"
        aria-label="Add more files"
      >
        <ImagePlus className="size-6" />
        <span className="text-[10px] font-medium">إضافة</span>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          multiple
          hidden
          onChange={handleAddMore}
        />
      </label>
    </div>
  );
}
