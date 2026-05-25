"use client";

import { useBunnyPlayer } from "../hooks/useBunnyPlayer";
import TamperResistantOverlay from "./TamperResistantOverlay";
import VideoError from "./VideoError";
import VideoQuestionBtn from "./VideoQuestionBtn";

interface VideoBunnyProps {
  response: {
    embed_url?: string;
    otp?: string;
    expires?: string | number;
  } | null;
  videoId: string;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  videoCompleted: boolean;
  communityAvailable: boolean;
}

export default function VideoBunny({
  response,
  videoId,
  roomId,
  classroomId,
  lessonId,
  videoCompleted,
  communityAvailable,
}: VideoBunnyProps) {
  const embedUrl = response?.embed_url;

  const { iframeRef } = useBunnyPlayer({
    videoId,
    roomId,
    classroomId,
    lessonId,
    videoCompleted,
  });

  if (!embedUrl) {
    return <VideoError />;
  }

  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <TamperResistantOverlay>
        <iframe
          ref={iframeRef}
          id="bunny-iframe"
          className="relative h-[520px] w-full"
          src={embedUrl}
          loading="lazy"
          style={{ border: 0 }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          title="Bunny Video"
        />
      </TamperResistantOverlay>

      {communityAvailable && <VideoQuestionBtn videoId={videoId} />}
    </div>
  );
}
