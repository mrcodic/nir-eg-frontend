import { cn } from "@/lib/utils";

function CountBubble({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-[#B75050] absolute -top-1 -right-1  text-center rounded-full p-1 pt-1.5 text-white size-5 text-[10px] flex items-center justify-center",
        className
      )}
    >
      {count > 99 ? (
        <>
          <sup className="text-xs">+</sup>
          <span>99</span>
        </>
      ) : (
        count
      )}
    </span>
  );
}

export default CountBubble;
