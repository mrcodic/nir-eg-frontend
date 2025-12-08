"use client";

import { ImageCropper } from "@/components/Cropper";
import { Avatar } from "@/components/ui/avatar";
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
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  useEffect(() => {
    setValue("avatar", selectedFile);
  }, [selectedFile]);

  return (
    <div className="relative flex gap-5 w-full flex-col sm:flex-row max-sm:items-center">
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
          className="size-24 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
        >
          <input {...getInputProps()} id="file" />
          <CustomImage src={defaultAvatar} alt="user avatar" size={96} />
        </Avatar>
      )}

      <div className="flex items-end gap-4 sm:ms-auto max-sm:justify-center">
        <label
          htmlFor="file"
          className="self-end cursor-pointer shrink-0 p-2 rounded-lg flex gap-4 h-11 bg-primary-800 hover:bg-primary-800/90"
        >
          <span className="text-white  font-bold">
            {selectedFile ? "تعديل الصورة" : "إضافة صورة"}
          </span>
        </label>

        {selectedFile && (
          <Button
            type="button"
            onClick={() => setSelectedFile(null)}
            variant="destructive"
            className="font-bold text-base h-11"
          >
            مسح الصورة
          </Button>
        )}
      </div>
    </div>
  );
}
