"use client";

import { ImageCropper } from "@/components/Cropper";
import { Avatar } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import CustomImage from "./ui/CustomImage";

export type FileWithPreview = FileWithPath & {
  preview: string;
  originalImage?: string;
};

const accept = {
  "image/*": [],
};

export default function UploadWithCrop({
  setValue,
  selectedFile,
  setSelectedFile,
  defaultAvatar,
}) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        alert("Selected image is too large!");
        return;
      }
      setValue("avatar", file);

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
        originalImage: URL.createObjectURL(file),
      });

      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  useEffect(() => {
    setValue("avatar", selectedFile);
  }, [selectedFile, setValue]);

  return (
    <div className="relative flex w-full flex-col gap-5 max-sm:items-center sm:flex-row">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-gray-200/60 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-10 text-white" />
        </div>
        {selectedFile ? (
          <ImageCropper
            dialogOpen={isDialogOpen}
            setDialogOpen={setDialogOpen}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        ) : (
          <Avatar
            {...getRootProps()}
            className="size-24 cursor-pointer ring-2 ring-slate-200 ring-offset-2"
          >
            <input {...getInputProps()} id="file" />
            <CustomImage
              src={defaultAvatar}
              alt="user avatar"
              size={96}
              className="rounded-full"
            />
          </Avatar>
        )}
      </div>

      <div className="flex items-end gap-4 max-sm:justify-center sm:ms-auto">
        <label
          htmlFor="file"
          className="bg-primary-800 hover:bg-primary-800/90 flex h-11 shrink-0 cursor-pointer items-center gap-4 self-end rounded-lg p-2"
        >
          <span className="font-bold text-white">
            {selectedFile ? "تعديل الصورة" : "إضافة صورة"}
          </span>
        </label>

        {selectedFile && (
          <Button
            type="button"
            onClick={() => setSelectedFile(null)}
            variant="destructive"
            className="h-11 text-base font-bold"
          >
            ازالة الصورة
          </Button>
        )}
      </div>
    </div>
  );
}
