"use client";

import TamperResistantOverlay from "@/modules/video/components/TamperResistantOverlay";
import VideoQuestionBtn from "@/modules/video/components/VideoQuestionBtn";
import { useVideoCipherPlayer } from "@/modules/video/hooks/useVideoCipherPlayer";
import VideoError from "./VideoError";

interface VideoCipherProps {
  response: { otp?: string; playbackInfo?: string } | null;
  videoId: string;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  videoCompleted: boolean;
  communityAvailable: boolean;
}

export default function VideoCipher({
  response,
  videoId,
  roomId,
  classroomId,
  lessonId,
  videoCompleted,
  communityAvailable,
}: VideoCipherProps) {
  const { iframeRef } = useVideoCipherPlayer({
    response,
    videoId,
    roomId,
    classroomId,
    lessonId,
    videoCompleted,
  });

  if (!response?.otp) {
    return <VideoError />;
  }

  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <TamperResistantOverlay>
        <iframe
          ref={iframeRef}
          id="vdocipher-iframe"
          className="relative h-[520px] w-full"
          src={`https://player.vdocipher.com/v2/?otp=${response.otp}&playbackInfo=${response.playbackInfo}`}
          style={{ border: 0 }}
          allow="encrypted-media"
          allowFullScreen
          title="VdoCipher Video"
        />
      </TamperResistantOverlay>

      {communityAvailable && (
        <VideoQuestionBtn playerRef={iframeRef} videoId={videoId} />
      )}
    </div>
  );
}
