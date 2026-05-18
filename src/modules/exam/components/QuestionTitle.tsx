"use client";

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
              videoState === "error"
                ? "الفيديو غير متاح"
                : showVideo
                  ? "إخفاء الفيديو"
                  : "عرض الفيديو"
            }
            className={
              videoState === "error" ? "opacity-50 grayscale" : "animate-pulse"
            }
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
        <div>
          {videoState === "error" ? (
            <div className="flex max-w-[360px] items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>⚠️</span>
              <span>الفيديو غير متاح أو الرابط غير صحيح</span>
            </div>
          ) : (
            <iframe
              key={iframeSrc}
              src={iframeSrc}
              className="aspect-video rounded-lg"
              style={{ maxWidth: "360px", width: "100%" }}
              onLoad={() => setVideoState("loaded")}
              onError={() => setVideoState("error")}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionTitle;
