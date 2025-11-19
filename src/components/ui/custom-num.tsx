import { cn } from "@/lib/utils";
import Image from "next/image";

function CustomNum({
  num,
  className,
  textClassName,
}: {
  num: number;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={cn(
        "size-8 aspect-square relative flex items-center justify-center",
        className
      )}
    >
      <Image
        src="/assets/num-bg.svg"
        fill
        className="aspect-square object-contain"
        alt="feature"
      />
      <span
        className={cn("relative text-xl -mt-1 z-10 text-white ", textClassName)}
        style={{
          textShadow: "2px 2px 2px #000000",
        }}
      >
        {num}
      </span>
    </div>
  );
}

export default CustomNum;
