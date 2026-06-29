"use client";

import { useState } from "react";
import { useToast } from "./use-toast";

function useFileDownload({
  attachment,
}: {
  attachment: {
    name?: string;
    url: string;
  };
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isDownloading || !attachment?.url) return;

    try {
      setIsDownloading(true);

      /**
       * Electron desktop download
       * ده اللي بيخلي التحميل ينزل direct في Downloads
       * ويفعل DownloadListener + progress toast + show in folder
       */
      if (typeof window !== "undefined" && window.electron?.downloadFile) {
        const downloadUrl = new URL(
          attachment.url,
          window.location.origin,
        ).toString();

        window.electron.downloadFile(downloadUrl);

        // التحميل الحقيقي بيتابع من DownloadListener
        // بنفك الزرار بعد لحظة عشان ميفضلش stuck
        setTimeout(() => {
          setIsDownloading(false);
        }, 800);

        return;
      }

      /**
       * Web fallback فقط لو مش شغال داخل Electron
       */
      const res = await fetch(
        `/api/blob-proxy?url=${encodeURIComponent(attachment.url)}`,
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = attachment?.name || "file";
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

      setIsDownloading(false);
    } finally {
      if (typeof window === "undefined" || !window.electron?.downloadFile) {
        setIsDownloading(false);
      }
    }
  };

  return { handleDownload, isDownloading };
}

export default useFileDownload;