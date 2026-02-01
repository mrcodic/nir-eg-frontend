import useFileDownload from "@/hooks/useFileDownload";
import { Download } from "lucide-react";
import SmallSpinner from "./custom/SmallSpinner";
import { Button } from "./ui/button";

function DownloadFileBtn({
  attachment,
}: {
  attachment: { name: string; url: string };
}) {
  const { handleDownload, isDownloading } = useFileDownload({
    attachment,
  });
  return (
    <Button
      disabled={isDownloading}
      onClick={handleDownload}
      className="flex items-center gap-2 opacity-60"
    >
      {isDownloading ? (
        <SmallSpinner className="size-4" />
      ) : (
        <Download size={16} />
      )}
      نزل الملف من هنا
    </Button>
  );
}

export default DownloadFileBtn;
