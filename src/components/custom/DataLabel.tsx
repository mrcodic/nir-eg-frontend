import { cn } from "@/lib/utils";

export default function DataLabel({
  text,
  children,
  value,
  className,
  textClassName,
  valueClassName,
}: {
  text: string;
  children?: React.ReactNode;
  value?: string;
  className?: string;
  textClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 text-[14px] text-nowrap ",
        className
      )}
    >
      <span className={cn(" text-[#454545] font-bold ", textClassName)}>
        {" "}
        {text} :
      </span>
      <div className={cn("font-extrabold flex gap-4 ", valueClassName)}>
        {children} {value}
      </div>
    </div>
  );
}
