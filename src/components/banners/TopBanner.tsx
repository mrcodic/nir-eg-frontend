import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { memo, useState } from "react";

function TopBanner({
  render,
  className,
  showClose = true,
  icon,
  iconClassName,
}: {
  render: React.ReactNode;
  className?: string;
  showClose?: boolean;
  icon?: React.ReactNode;
  iconClassName?: string;
}) {
  const [hideBanner, setHideBanner] = useState(false);

  if (hideBanner) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-secondary relative mb-4 flex items-center gap-2 rounded-lg border bg-white p-2 text-black",
        className,
      )}
    >
      {showClose && (
        <button
          onClick={() => setHideBanner(true)}
          className="absolute top-1 left-1 cursor-pointer"
        >
          <X className="size-4 stroke-yellow-700" />
        </button>
      )}

      {icon ? (
        typeof icon === "string" ? (
          <Image
            src={icon}
            width={24}
            height={24}
            alt="icon"
            className={iconClassName}
          />
        ) : (
          icon
        )
      ) : null}

      {render}
    </div>
  );
}

export default memo(TopBanner);
