import Image from "next/image";
import React from "react";

export default function VideoError({
  message,
  src,
}: {
  message?: string;
  src?: string;
}) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center gap-4 bg-white">
      <div className="relative mx-auto aspect-square w-full max-w-71">
        <Image
          src={src || "/assets/bg/error.svg"}
          alt="NIR EDU"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-bold">{message || "حدث خطأ ما"}</p>
      </div>
    </div>
  );
}
