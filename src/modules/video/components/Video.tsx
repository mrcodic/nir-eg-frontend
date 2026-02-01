"use client";
import TopBanner from "@/components/banners/TopBanner";
import LoadingSpinner from "@/components/LoadingSpinner";
import TamperResistantOverlay from "@/modules/video/components/TamperResistantOverlay";
import { FileWarning } from "lucide-react";
import Image from "next/image";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import VideoQuestionBtn from "./VideoQuestionBtn";

interface VideoProps {
  response: { otp?: string; playbackInfo?: string } | null;
  videoId: string;
  locked: boolean;
  setCurrentTime(time: number): void;
  exceededViews: boolean;
  roomId: string | number;
  classroomId: string | number;
  lessonId: string | number;
  videoCompleted: boolean;
  otpError: boolean;
  otpLoading: boolean;
}

export default function Video(props: VideoProps) {
  const {
    response,
    videoId,
    locked,
    setCurrentTime,
    exceededViews,
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

  if (locked) {
    return (
      <div className="flex-1 space-y-8">
        <TopBanner
          icon={<img src="/assets/icons/WarningColor.svg" alt="warning" />}
          render={
            <span className="text-sm font-medium">
              {exceededViews
                ? "لقد تجاوزت الحد الأقصى لعدد المشاهدات المسموح بها لهذا الدرس"
                : "يجب ان تقوم باجتياز الاختبار أولا"}
            </span>
          }
          showClose={false}
        />

        <div className="flex h-[520px] w-full flex-1 items-center justify-center bg-gray-100">
          <Image
            src="/assets/Locked.png"
            width={150}
            height={150}
            alt="Locked"
          />
        </div>
      </div>
    );
  }

  if (otpError) {
    return (
      <div className="bg-background flex min-h-[520px] items-center justify-center">
        <div className="flex items-center gap-2">
          <FileWarning className="stroke-red-500" />
          <p className="text-lg font-bold">حدث خطأ ما</p>
        </div>
      </div>
    );
  }

  if (otpLoading || !response?.otp) {
    return <LoadingSpinner className="min-h-[520px]" />;
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
