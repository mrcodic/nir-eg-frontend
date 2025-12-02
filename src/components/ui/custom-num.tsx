import { cn } from "@/lib/utils";

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
        "md:size-10 size-8 aspect-square relative flex items-center justify-center bg-dark-radial rounded-lg",
        className
      )}
    >
      <span
        className={cn(
          "relative text-base md:text-xl -mt-1 z-10 text-white ",
          textClassName
        )}
      >
        {num}
      </span>
    </div>
  );
}

export default CustomNum;
