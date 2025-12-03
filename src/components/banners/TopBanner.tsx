import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

function TopBanner({
  render,
  className,
  showClose = true,
  icon,
}: {
  render: React.ReactNode;
  className?: string;
  showClose?: boolean;
  icon?: React.ReactNode;
}) {
  const [hideBanner, setHideBanner] = useState(false);
  if (hideBanner) {
    return null;
  }
  return (
    <div
      className={cn(
        "bg-white border relative border-secondary text-black p-2 mb-4 rounded-lg flex items-center gap-2 ",
        className
      )}
    >
      {showClose && (
        <button
          onClick={() => setHideBanner(true)}
          className="absolute top-1 left-1 cursor-pointer"
        >
          <X className="stroke-yellow-700 size-5" />
        </button>
      )}
      {icon}

      {render}
    </div>
  );
}

export default TopBanner;
