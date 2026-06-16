import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import useFileDownload from "@/hooks/useFileDownload";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

function DownloadFileBtn({
  attachment,
  className,
}: {
  attachment: { name: string; url: string };
  className?: string;
}) {
  const { handleDownload, isDownloading } = useFileDownload({
    attachment,
  });

  return (
    <Button
      disabled={isDownloading}
      onClick={handleDownload}
      className={cn("flex items-center gap-2", className)}
    >
      {isDownloading ? (
        <SmallSpinner className="size-4 text-white" />
      ) : (
        <Download size={16} />
      )}
      نزل الملف من هنا
    </Button>
  );
}

export default DownloadFileBtn;
