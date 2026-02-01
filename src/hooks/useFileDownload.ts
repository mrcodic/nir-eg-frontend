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

  const handleDownload = async () => {
    if (isDownloading) return;

    console.log("download  ------- --", attachment);

    try {
      setIsDownloading(true);

      const res = await fetch(attachment.url);

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
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleDownload, isDownloading };
}

export default useFileDownload;
