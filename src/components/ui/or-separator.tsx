import { cn } from "@/lib/utils";

export default function OrSeparator({
  label = "او",
  className,
  lineClassName,
  labelClassName,
}: {
  label?: string;
  className?: string;
  lineClassName?: string;
  labelClassName?: string;
}) {
  return (
    <div
      className={cn(
        "text-secondary relative flex h-4 items-center justify-center text-xs font-bold",
        className,
      )}
    >
      <hr className={cn("border-gray-light my-1 h-1 w-full", lineClassName)} />
      <span
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1",
          labelClassName,
        )}
      >
        {label}
      </span>
    </div>
  );
}
