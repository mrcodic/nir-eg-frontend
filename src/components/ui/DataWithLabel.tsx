import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DataWithLabelProps {
  label: string;
  data: ReactNode;
  labelClassName?: string;
  dataClassName?: string;
  className?: string;
  icon?: ReactNode;
  dataIcon?: ReactNode;
}

function DataWithLabel({
  label,
  data,
  labelClassName,
  dataClassName,
  className,
  icon,
  dataIcon,
}: DataWithLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <p className={cn("text-gray-dark font-bold", labelClassName)}>
          {label}:
        </p>
      </div>
      <p className={cn("font-bold text-black", dataClassName)}>
        {data} {dataIcon}
      </p>
    </div>
  );
}

export default DataWithLabel;
