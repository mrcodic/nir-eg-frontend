import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

function FilterControls({
  filterMode,
  setFilterMode,
}: {
  filterMode: string;
  setFilterMode: Dispatch<SetStateAction<"current" | "all">>;
}) {
  return (
    <div className="ms-auto flex gap-2">
      <Button
        variant="outline-primary"
        className={cn("h-8 p-2 text-xs font-medium", {
          "bg-primary-800 text-white": filterMode === "current",
        })}
        onClick={() => setFilterMode("current")}
      >
        الوقت الحالي
      </Button>
      <Button
        variant="outline-primary"
        className={cn("h-8 p-2 text-xs font-medium", {
          "bg-primary-800 text-white": filterMode === "all",
        })}
        onClick={() => setFilterMode("all")}
      >
        جميع التعليقات
      </Button>
    </div>
  );
}

export default FilterControls;
