import { FileWarning } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function VideoError({ message }: { message?: string }) {
  return (
    <div className="bg-background flex min-h-[520px] items-center justify-center gap-4">
      <div className="relative mx-auto aspect-square w-full max-w-71">
        <Image
          src="/assets/bg/suspended.png"
          alt="NIR EDU"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <FileWarning className="stroke-red-500" />
        <p className="text-lg font-bold">{message || "حدث خطأ ما"}</p>
      </div>
    </div>
  );
}
