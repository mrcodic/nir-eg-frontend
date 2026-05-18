"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  title: string;
  video?: string;
  isSubQuestion?: boolean;
};

type VideoState = "idle" | "loaded" | "error";

/** Returns true only if the string is a well-formed http/https URL */
function isValidUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const QuestionTitle = ({ title, video }: Props) => {
  const urlValid = useMemo(() => isValidUrl(video), [video]);

  const [showVideo, setShowVideo] = useState(false);
  const [videoState, setVideoState] = useState<VideoState>(
    urlValid ? "idle" : "error",
  );

  const handleToggle = () => {
    setShowVideo((s) => !s);
    if (!showVideo && urlValid) setVideoState("idle");
  };

  const iframeSrc = useMemo(() => {
    if (!video) return undefined;
    return video.includes("youtube")
      ? video.replace("watch?v=", "embed/")
      : video;
  }, [video]);

  const isLoading = videoState === "idle";
  const isError = videoState === "error";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="mt-4 mb-8 flex items-start gap-1 text-[15px] text-black md:text-[18px]">
          {title.trim().startsWith("<") ? (
            <div
              dangerouslySetInnerHTML={{ __html: title }}
              className="break-all *:break-all"
            />
          ) : (
            title
          )}
        </div>

        {video && (
          <button
            type="button"
            onClick={handleToggle}
            title={
              isError
                ? "الفيديو غير متاح"
                : showVideo
                  ? "إخفاء الفيديو"
                  : "عرض الفيديو"
            }
            className={isError ? "opacity-50 grayscale" : "animate-pulse"}
          >
            <Image
              src={"/assets/show-video.svg"}
              width={32}
              height={32}
              alt="show video btn"
            />
          </button>
        )}
      </div>

      {video && showVideo && (
        <div className="relative w-full max-w-[360px]">
          {isError ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>⚠️</span>
              <span>الفيديو غير متاح أو الرابط غير صحيح</span>
            </div>
          ) : (
            <>
              {/* Skeleton shown while loading */}
              {isLoading && (
                <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-gray-800">
                  <Loader2 className="h-10 w-10 animate-spin rounded-full stroke-white" />
                </div>
              )}

              {/* iframe always rendered so onLoad fires; hidden until loaded */}
              <iframe
                key={iframeSrc}
                src={iframeSrc}
                className="aspect-video w-full rounded-lg"
                style={{
                  opacity: isLoading ? 0 : 1,
                  position: isLoading ? "absolute" : "static",
                  inset: 0,
                  pointerEvents: isLoading ? "none" : "auto",
                }}
                onLoad={() => setVideoState("loaded")}
                onError={() => setVideoState("error")}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionTitle;
