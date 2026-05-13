"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  video?: string;
  isSubQuestion?: boolean;
};

const QuestionTitle = ({ title, video }: Props) => {
  const [showVideo, setShowVideo] = useState(false);

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
            onClick={() => setShowVideo((s) => !s)}
            className="animate-pulse"
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
        <iframe
          src={
            video?.includes("youtube")
              ? video.replace("watch?v=", "embed/")
              : video
          }
          className="aspect-video rounded-lg"
          style={{
            maxWidth: "360px",
            width: "100%",
          }}
        />
      )}
    </div>
  );
};

export default QuestionTitle;
