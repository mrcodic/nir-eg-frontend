import { normalizeYouTubeUrl } from "@/utils/clientFun";
import { useState } from "react";

function YoutubeVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const [iframeLoading, setIframeLoading] = useState(true);

  return (
    <div className="relative aspect-video min-h-[200px] w-full">
      {iframeLoading && (
        <div className="bg-background absolute inset-0 z-10 flex items-center justify-center">
          <div className="border-primary-800 size-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}

      <iframe
        src={normalizeYouTubeUrl(videoUrl)}
        className="h-full w-full"
        style={{ border: 0 }}
        allow="encrypted-media"
        allowFullScreen
        onLoad={() => setIframeLoading(false)}
      />
    </div>
  );
}

export default YoutubeVideoPlayer;
