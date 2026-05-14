"use client";

import TamperResistantOverlay from "@/modules/video/components/TamperResistantOverlay";
import VideoQuestionBtn from "@/modules/video/components/VideoQuestionBtn";
import { useVideoCipherPlayer } from "@/modules/video/hooks/useVideoCipherPlayer";
import VideoError from "./VideoError";

interface VideoCipherProps {
  response: { otp?: string; playbackInfo?: string } | null;
  videoId: string;
  setCurrentTime(time: number): void;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  videoCompleted: boolean;
}

export default function VideoCipher({
  response,
  videoId,
  setCurrentTime,
  roomId,
  classroomId,
  lessonId,
  videoCompleted,
}: VideoCipherProps) {
  const { iframeRef } = useVideoCipherPlayer({
    response,
    videoId,
    roomId,
    classroomId,
    lessonId,
    setCurrentTime,
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

      <VideoQuestionBtn playerRef={iframeRef} videoId={videoId} />
    </div>
  );
}
