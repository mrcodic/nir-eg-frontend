"use client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import TamperResistantOverlay from "@/modules/video/components/TamperResistantOverlay";
import VideoQuestionBtn from "@/modules/video/components/VideoQuestionBtn";
import { useVideoPlayer } from "@/modules/video/hooks/useVideoPlayer";
import { FileWarning } from "lucide-react";

interface VideoCipherProps {
  response: { otp?: string; playbackInfo?: string } | null;
  videoId: string;
  setCurrentTime(time: number): void;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  videoCompleted: boolean;
  otpError: boolean;
  otpLoading: boolean;
}

export default function VideoCipher(props: VideoCipherProps) {
  const {
    response,
    videoId,
    setCurrentTime,
    roomId,
    classroomId,
    lessonId,
    videoCompleted,
    otpError,
    otpLoading,
  } = props;

  const { iframeRef, hideBtn, setHideBtn } = useVideoPlayer({
    response,
    videoId,
    roomId,
    classroomId,
    lessonId,
    setCurrentTime,
    videoCompleted,
  });

  if (otpError) {
    return (
      <div className="bg-background flex min-h-[520px] items-center justify-center">
        <div className="flex items-center gap-2">
          <FileWarning className="stroke-red-500" />
          <p className="text-lg font-bold">حدث خطأ ما</p>
        </div>
      </div>
    );
  }

  if (otpLoading) {
    return <LoadingSpinner className="bg-primary-50 h-fit min-h-[520px]" />;
  }

  if (!response?.otp) {
    return (
      <div className="bg-background flex min-h-[520px] items-center justify-center">
        <div className="flex items-center gap-2">
          <FileWarning className="stroke-red-500" />
          <p className="text-lg font-bold">حدث خطأ ما</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-fit flex-1 overflow-hidden">
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

      {!hideBtn && (
        <VideoQuestionBtn playerRef={iframeRef} setHideBtn={setHideBtn} />
      )}
    </div>
  );
}
