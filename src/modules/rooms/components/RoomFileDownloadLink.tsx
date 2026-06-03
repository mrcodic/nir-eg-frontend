"use client";

import useFileDownload from "@/hooks/useFileDownload";
import LinkLocked from "@/layouts/LinkLocked";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  attachment: {
    name: string;
    url: string;
  };
  room: any;
  subscribe: boolean;
  verify: boolean;
  locked: boolean;
  index: number;
  className?: string;
};

function RoomFileDownloadLink({
  attachment,
  room,
  subscribe,
  verify,
  locked,
  index,
  className,
}: Props) {
  const { handleDownload, isDownloading } = useFileDownload({
    attachment,
  });

  const isLocked =
    room?.locked_to_pass || room?.latest_room?.locked_to_pass || locked;

  return (
    <div
      key={index}
      className={cn(
        "bg-background border-gray-light flex justify-between gap-2 rounded-md border p-2",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-bold">
        <Image
          width={28}
          height={28}
          className="size-7"
          src="/assets/files-fill.svg"
          alt="file icon"
        />
        <span className="line-clamp-1">{attachment.name}</span>
      </div>

      {subscribe && verify && (
        <LinkLocked locked={isLocked}>
          <button
            role="button"
            onClick={handleDownload}
            className="cursor-pointer text-sm font-medium"
          >
            {isDownloading ? "جاري التحميل..." : "تنزيل الملف"}
          </button>
        </LinkLocked>
      )}
    </div>
  );
}

export default RoomFileDownloadLink;
