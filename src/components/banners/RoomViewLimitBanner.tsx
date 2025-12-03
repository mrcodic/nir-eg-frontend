import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

function RoomViewLimitBanner({
  viewCount,
  className,
}: {
  viewCount: any;
  className?: string;
}) {
  const [hideBanner, setHideBanner] = useState(false);
  if (hideBanner) {
    return null;
  }
  return (
    <div
      className={cn(
        "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded absolute top-2 inset-x-2 w-[calc(100%-1rem)] z-10",
        className
      )}
    >
      <button
        onClick={() => setHideBanner(true)}
        className="absolute top-1 left-1 cursor-pointer"
      >
        <X className="stroke-yellow-700 size-5" />
      </button>
    </div>
  );
}

export default RoomViewLimitBanner;
