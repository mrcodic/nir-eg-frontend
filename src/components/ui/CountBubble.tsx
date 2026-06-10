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
        "bg-semantics-red absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-1 text-center text-[10px] text-white",
        className,
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
