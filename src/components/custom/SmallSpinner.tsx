import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const SmallSpinner = ({ className }: { className?: string }) => {
  return (
    <Loader2 className={cn("text-secondary size-8 animate-spin", className)} />
  );
};

export default SmallSpinner;
