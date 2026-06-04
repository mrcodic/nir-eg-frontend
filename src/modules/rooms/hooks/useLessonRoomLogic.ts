import { mutateClient } from "@/helpers/fetchers/post-client";
import { getActionErrorMeta } from "@/lib/errorCodes";
import { useRoomDetailsData } from "@/modules/rooms/hooks/useRoomDetailsData";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface IOtpViewStatus {
  used: number;
  remaining: number;
  total_views: number;
}

type OtpData = {
  otp?: string;
  expires?: string | number;
  embed_url?: string;
  hls_url?: string;
  expires_in?: number;
  provider?: string;
  playbackInfo?: string;
  viewsStats?: IOtpViewStatus;
  lockedByViewLimit: boolean;
};

type OtpStatus = {
  error: boolean;
  loading: boolean;
  message?: string;
};

const initOtpStatus: OtpStatus = {
  error: false,
  loading: true,
};

function useLessonRoomLogic({
  classroomId,
  roomId,
  lessonId,
}: {
  classroomId: string;
  roomId: string;
  lessonId: string;
}) {
  const { roomDetails, isLoadingRoomDetails } = useRoomDetailsData({
    classroomId,
    roomId,
  });

  const [otpData, setOtpData] = useState<OtpData | null>(null);
  const [otpStatus, setOtpStatus] = useState<OtpStatus>(initOtpStatus);

  const selectedLesson = useMemo(() => {
    const parsedLessonId = Number(lessonId);
    if (!Number.isFinite(parsedLessonId)) return null;

    return (
      roomDetails?.lessons?.find((lesson) => lesson.id === parsedLessonId) ??
      null
    );
  }, [lessonId, roomDetails?.lessons]);

  const selectedVideoType = selectedLesson?.video_type ?? null;
  const videoCompleted = Boolean(selectedLesson?.completed);
  const videoId =
    selectedVideoType && selectedVideoType !== "youtube"
      ? (selectedLesson?.video_id ?? "")
      : "";
  const videoUrl =
    selectedVideoType === "youtube" ? (selectedLesson?.video_link ?? "") : "";

  const fetchOtpAndViews = useCallback(
    async (selectedVideoId: string) => {
      setOtpStatus({ loading: true, error: false });

      try {
        const res = await mutateClient("/video/otp", {
          body: {
            video_id: selectedVideoId,
            classroom_id: classroomId,
            room_id: roomId,
          },
        });

        setOtpData({
          otp: res?.otp,
          expires: res?.expires,
          embed_url: res?.embed_url,
          hls_url: res?.hls_url,
          expires_in: res?.expires_in,
          provider: res?.provider,
          playbackInfo: res?.playbackInfo,
          viewsStats: {
            used: res?.views_used,
            remaining: res?.views_remaining,
            total_views: res?.total_views,
          },
          lockedByViewLimit: res?.views_used >= res?.total_views,
        });

        setOtpStatus({ loading: false, error: false });
      } catch (error) {
        const errorStatus = axios.isAxiosError(error) && error.response?.status;
        const apiCode = axios.isAxiosError(error)
          ? error.response?.data?.code
          : undefined;

        if (errorStatus === 403) {
          const meta = getActionErrorMeta(errorStatus, apiCode);

          if (apiCode === 410 || apiCode === 415) {
            setOtpStatus({
              loading: false,
              error: true,
              message: meta.description,
            });
          } else {
            setOtpData({ lockedByViewLimit: true });
          }
        }

        setOtpStatus((prev) => ({ ...prev, loading: false, error: true }));
      }
    },
    [classroomId, roomId],
  );

  useEffect(() => {
    setOtpData(null);
    setOtpStatus(initOtpStatus);
    useVideoPlayerStore.getState().setCurrentTime(0);
    useVideoPlayerStore.getState().setIsPlaying(false);
  }, [lessonId]);

  useEffect(() => {
    if (!selectedLesson) return;

    if (selectedVideoType === "youtube") {
      setOtpData(null);
      setOtpStatus({ loading: false, error: false });
      return;
    }

    if (
      (selectedVideoType === "cipher" || selectedVideoType === "bunny") &&
      videoId &&
      !otpData
    ) {
      fetchOtpAndViews(videoId);
    }
  }, [fetchOtpAndViews, otpData, selectedLesson, selectedVideoType, videoId]);

  return {
    roomDetails,
    isLoadingLesson: isLoadingRoomDetails,
    lessonId: selectedLesson?.id ?? null,
    selectedLesson,
    otpData,
    videoId,
    videoUrl,
    otpStatus,
    selectedVideoType,
    videoCompleted,
  };
}

export default useLessonRoomLogic;
