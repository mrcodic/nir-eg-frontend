import type { PixelCrop } from "react-image-crop";

export async function cropImage(
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<Blob> {
  const canvas = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Crop failed");
      resolve(blob);
    }, "image/jpeg");
  });
}
