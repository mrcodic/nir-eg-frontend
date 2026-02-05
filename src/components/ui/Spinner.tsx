import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function Spinner({
  className,
  spinnerClassName,
}: {
  className?: string;
  spinnerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-full min-h-[300px]",
        className,
      )}
    >
      <Loader2 className={cn("animate-spin", spinnerClassName)} size={24} />
    </div>
  );
}

export default Spinner;
