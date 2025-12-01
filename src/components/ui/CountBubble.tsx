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
        "bg-[#B75050] absolute -top-1 -right-1  text-center rounded-full text-white size-4 text-[10px] flex items-center justify-center",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default CountBubble;
