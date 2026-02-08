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
  originalFileName?: string;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

export function ImageCropDialog({
  open,
  src,
  aspect,
  originalFileName,
  onClose,
  onConfirm,
}: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();

  // Initialize crop when image loads
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // Calculate initial crop dimensions that fit within image bounds
      let cropWidth: number;
      let cropHeight: number;

      if (aspect) {
        // With aspect ratio: fit the largest crop area possible
        if (width / height > aspect) {
          // Image is wider than aspect ratio
          cropHeight = Math.min(height * 0.8, height - 20);
          cropWidth = cropHeight * aspect;
        } else {
          // Image is taller than aspect ratio
          cropWidth = Math.min(width * 0.8, width - 20);
          cropHeight = cropWidth / aspect;
        }
      } else {
        // Without aspect ratio: 80% of smallest dimension
        const minDimension = Math.min(width, height);
        cropWidth = Math.min(minDimension * 0.8, width - 20);
        cropHeight = Math.min(minDimension * 0.8, height - 20);
      }

      // Ensure crop doesn't exceed image bounds
      cropWidth = Math.min(cropWidth, width - 10);
      cropHeight = Math.min(cropHeight, height - 10);

      // Center the crop
      const x = (width - cropWidth) / 2;
      const y = (height - cropHeight) / 2;

      setCrop({
        unit: "px",
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: cropWidth,
        height: cropHeight,
      });
    },
    [aspect],
  );

  // Handle click to move crop area
  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (!imgRef.current || !crop) return;

      const img = imgRef.current;
      const rect = img.getBoundingClientRect();

      // Calculate click position relative to the image
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert to image coordinates (accounting for displayed size vs natural size)
      const scaleX = img.width / rect.width;
      const scaleY = img.height / rect.height;

      const imageClickX = clickX * scaleX;
      const imageClickY = clickY * scaleY;

      // Calculate new crop position (center crop on click point)
      let newX = imageClickX - crop.width / 2;
      let newY = imageClickY - crop.height / 2;

      // Ensure crop stays within image bounds
      newX = Math.max(0, Math.min(newX, img.width - crop.width));
      newY = Math.max(0, Math.min(newY, img.height - crop.height));

      setCrop({
        ...crop,
        x: newX,
        y: newY,
      });
    },
    [crop],
  );

  const handleConfirm = useCallback(async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;

    const blob = await cropImage(imgRef.current, crop as PixelCrop);

    // Preserve original filename, fallback to "cropped" if not provided
    const fileName = originalFileName || "cropped.jpg";
    // Keep the original name but ensure the extension matches the blob type
    const extension = blob.type.split("/")[1] || "jpg";
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    const finalName = `${nameWithoutExt}.${extension}`;

    const file = new File([blob], finalName, {
      type: blob.type,
    });

    onConfirm(file);
    onClose();
  }, [crop, onConfirm, onClose, originalFileName]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>قص الصورة</DialogTitle>
        </DialogHeader>

        <div className="relative max-h-[520px] overflow-hidden overflow-y-auto">
          <ReactCrop
            crop={crop}
            onChange={(nextCrop) => setCrop(nextCrop)}
            aspect={aspect}
            keepSelection
            className="w-full  flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Crop"
              onLoad={onImageLoad}
              onClick={handleImageClick}
              className="w-full max-h-[520px] object-contain select-none cursor-crosshair"
              draggable={false}
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleConfirm} disabled={!crop}>
            تأكيد
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
