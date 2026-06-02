"use client";

import useFileDownload from "@/hooks/useFileDownload";
import LinkLocked from "@/layouts/LinkLocked";
import Image from "next/image";

type Props = {
  attachment: {
    name: string;
    url: string;
  };
  room: any;
  subscribe: boolean;
  verify: boolean;
  lock_after: number;
  index: number;
};

function RoomFileDownloadLink({
  attachment,
  room,
  subscribe,
  verify,
  lock_after,
  index,
}: Props) {
  const { handleDownload, isDownloading } = useFileDownload({
    attachment,
  });

  const isLocked =
    room?.locked_to_pass ||
    room?.latest_room?.locked_to_pass ||
    lock_after === 0;

  return (
    <div
      key={index}
      className="bg-background border-gray-light flex justify-between rounded-md border p-2"
    >
      <div className="flex items-center gap-2 font-bold">
        <Image
          width={28}
          height={28}
          className="size-7"
          src="/assets/files-fill.svg"
          alt="file icon"
        />
        <span>{attachment.name}</span>
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
