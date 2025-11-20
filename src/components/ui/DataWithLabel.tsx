import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DataWithLabelProps {
  label: string;
  data: ReactNode;
  labelClassName?: string;
  dataClassName?: string;
  className?: string;
}

function DataWithLabel({
  label,
  data,
  labelClassName,
  dataClassName,
  className,
}: DataWithLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <p className={cn("text-gray-dark font-bold", labelClassName)}>{label}:</p>
      <p className={cn("text-[#121212] font-bold", dataClassName)}>{data}</p>
    </div>
  );
}

export default DataWithLabel;
