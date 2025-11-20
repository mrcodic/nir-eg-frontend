"use client";

import { ImageCropper } from "@/components/Cropper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

const accept = {
  "image/*": [],
};

export default function UploadWithCrop({
  setValue,
  selectedFile,
  setSelectedFile,
  avatar,
}) {
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        alert("Selected image is too large!");
        return;
      }
      console.log(file);
      setValue("avatar", file);

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
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
    <div className="relative flex gap-5 ">
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
          className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
        >
          <input {...getInputProps()} id="file" />
          <AvatarImage src={avatar} alt="@shadcn" />
          <AvatarFallback>image</AvatarFallback>
        </Avatar>
      )}

      <label
        htmlFor="file"
        className="self-end cursor-pointer border border-primary p-2 rounded-lg flex gap-4"
      >
        <img src="/assets/Edit-1.svg" className="w-[20px] h-[20px]" />
        <span className="text-primary-700 underline text-sm font-bold">
          تغيير صورة الملف الشخصي
        </span>
      </label>

      {/* <div className=" absolute -bottom-12 left-28 ">
        <SvgText />
      </div> */}
    </div>
  );
}
