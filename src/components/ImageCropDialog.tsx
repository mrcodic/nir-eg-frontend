"use client";

import { useCallback, useRef, useState } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cropImage } from "@/lib/crop-image";

interface ImageCropDialogProps {
  open: boolean;
  src: string;
  aspect?: number;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

export function ImageCropDialog({
  open,
  src,
  aspect,
  onClose,
  onConfirm,
}: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 50,
    y: 50,
    width: 300,
    height: 300,
  });

  const handleConfirm = useCallback(async () => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    const blob = await cropImage(imgRef.current, crop as PixelCrop);

    const file = new File([blob], "cropped.jpg", {
      type: blob.type,
    });

    onConfirm(file);
    onClose();
  }, [crop, onConfirm, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>قص الصورة</DialogTitle>
        </DialogHeader>

        <div className="max-h-[500px] overflow-auto overflow-x-hidden">
          <ReactCrop
            crop={crop}
            onChange={(nextCrop) => setCrop(nextCrop)}
            aspect={aspect} // ✅ CORRECT PLACE
            keepSelection
            className="w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Crop"
              className="w-full object-contain"
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleConfirm}>تأكيد</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
