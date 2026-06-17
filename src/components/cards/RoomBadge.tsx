import { cn } from "@/lib/utils";
import Image from "next/image";

export default function RoomBadge({
  children,
  iconSrc,
  className,
}: {
  children: React.ReactNode;
  iconSrc?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "bg-background flex h-fit flex-wrap items-center justify-center gap-2 rounded-lg px-2 py-1 text-xs font-bold shadow-sm sm:text-sm",
        className,
      )}
    >
      {iconSrc && (
        <Image
          width={16}
          height={16}
          className="h-4 w-4"
          src={iconSrc}
          alt=""
        />
      )}
      {children}
    </p>
  );
}
