import Image from "next/image";

export default function VideoError({
  message,
  src,
}: {
  message?: string;
  src?: string;
}) {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-4 bg-white sm:h-[520px]">
      <div className="relative mx-auto aspect-square w-full max-w-30 sm:max-w-71">
        <Image
          src={src || "/assets/bg/error.svg"}
          alt="NIR EDU"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-center font-bold sm:text-lg">
          {message || "حدث خطأ ما"}
        </p>
      </div>
    </div>
  );
}
