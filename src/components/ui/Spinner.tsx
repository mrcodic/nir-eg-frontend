import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-full min-h-[300px]",
        className
      )}
    >
      <Loader className="animate-spin" size={24} />
    </div>
  );
}

export default Spinner;
