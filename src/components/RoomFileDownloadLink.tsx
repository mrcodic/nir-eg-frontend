"use client";

import { useToast } from "@/hooks/use-toast";
import LinkLocked from "@/layouts/LinkLocked";
import Image from "next/image";
import { useState } from "react";

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

const isProd = process.env.NODE_ENV === "production";

function RoomFileDownloadLink({
  attachment,
  room,
  subscribe,
  verify,
  lock_after,
  index,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const isLocked =
    room?.locked_to_pass ||
    room?.latest_room?.locked_to_pass ||
    lock_after === 0;

  const handleDownload = async () => {
    if (isDownloading) return;

    console.log("download  ------- --", attachment);

    try {
      setIsDownloading(true);

      const res = await fetch(
        isProd ? attachment.url : `/api/blob-proxy?url=${attachment.url}`,
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast({
        icon: "error",
        description: "حدث خطأ أثناء تحميل الملف",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      key={index}
      className="bg-background border-gray-light flex justify-between rounded-md border p-2"
    >
      <div className="flex items-center gap-2 font-bold">
        <Image
          width={28}
          height={28}
          className="size-7 bg-white"
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
