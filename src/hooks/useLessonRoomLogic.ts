import { getClientPrivateData } from "@/helpers/client-fetch";
import { mutateClient } from "@/helpers/post-client";
import { getActionErrorMeta } from "@/lib/errorCodes";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import { ApiResponse, IRoomDetails, LessonVideoType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
}: {
  classroomId: string;
  roomId: string;
}) {
  // ✅ FIX #2 — Explicit types instead of inferring `null` forever
  const [otpData, setOtpData] = useState<OtpData | null>(null);
  const [otpStatus, setOtpStatus] = useState<OtpStatus>(initOtpStatus);
  const [selectedVideoType, setSelectedVideoType] =
    useState<LessonVideoType | null>(null);
  const [lessonId, setLessonId] = useState<number | null>(null); // ✅ FIX #2

  const initLessonIdRef = useRef(false);

  const [videoId, setVideoId] = useQueryState("video_id", {
    defaultValue: "",
    history: "replace",
    shallow: true,
    clearOnDefault: true,
    parse: (v) => (v === "undefined" || v === "null" ? "" : v),
    serialize: (v) => (v === "undefined" || v === "null" ? "" : v),
  });

  const [videoUrl, setVideoUrl] = useQueryState("video_url", {
    defaultValue: "",
    history: "replace",
    shallow: true,
    clearOnDefault: true,
    parse: (v) =>
      v === "undefined" || v === "null" ? "" : decodeURIComponent(v),
    serialize: (v) =>
      v === "undefined" || v === "null" ? "" : encodeURIComponent(v),
  });

  const hasVideoId =
    videoId && videoId !== "" && videoId !== "null" && videoId !== "undefined";

  const { data, isLoading: isLoadingLesson } = useQuery({
    queryFn: getClientPrivateData as () => Promise<ApiResponse<IRoomDetails>>,
    queryKey: [`/students/get-lessons/${roomId}?classroom_id=${classroomId}`],
  });

  console.log("lesssons data : ", data);
  const videoCompleted = useMemo(() => {
    return (
      videoId &&
      data?.body?.lessons?.find((lesson) => lesson?.video_id === videoId)
        ?.completed
    );
  }, [data, videoId]);

  const selectedLesson = useMemo(
    () => data?.body?.lessons?.find((lesson) => lesson.id === lessonId),
    [data?.body?.lessons, lessonId],
  );

  const handleLessonSelect = useCallback(
    (vid: string, lessId: number, type: LessonVideoType) => {
      if (lessId === lessonId) return;

      if (type === "youtube") {
        setVideoUrl(vid);
        setVideoId(null);
      } else {
        setVideoId(vid);
        setVideoUrl(null);
      }

      setLessonId(lessId);
      setSelectedVideoType(type);
      setOtpData(null);
      setOtpStatus(initOtpStatus);
      useVideoPlayerStore.getState().setCurrentTime(0);
      useVideoPlayerStore.getState().setIsPlaying(false);
    },
    [lessonId, setVideoId, setVideoUrl],
  );

  // ✅ FIX #8 — `vid` explicitly typed as string
  const fetchOtpAndViews = useCallback(
    async (vid: string) => {
      setOtpStatus({ loading: true, error: false });

      try {
        const res = await mutateClient("/video/otp", {
          body: {
            video_id: vid,
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
        console.error("❌ OTP fetch failed", error);

        const errorStatus = axios.isAxiosError(error) && error.response?.status;
        const apiCode = axios.isAxiosError(error)
          ? error.response?.data?.code
          : undefined;

        if (errorStatus === 403) {
          const meta = getActionErrorMeta(errorStatus, apiCode);

          // VIDEO_BANDWIDTH_EXCEEDED / STORAGE_BANDWIDTH_EXCEEDED → show message
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
    if (
      hasVideoId &&
      (selectedVideoType === "cipher" || selectedVideoType === "bunny") &&
      !otpData
    ) {
      fetchOtpAndViews(videoId);
    }
  }, [fetchOtpAndViews, otpData, selectedVideoType, videoId, hasVideoId]);

  useEffect(() => {
    if (!data || initLessonIdRef.current) return;

    if (videoId) {
      const lesson = data.body.lessons.find((l) => l.video_id === videoId);
      if (lesson) {
        setLessonId(lesson.id);
        setSelectedVideoType(lesson.video_type);
        initLessonIdRef.current = true;
      }
      return;
    }

    if (videoUrl) {
      const lesson = data.body.lessons.find((l) => l.video_link === videoUrl);
      if (lesson) {
        setLessonId(lesson.id);
        setSelectedVideoType(lesson.video_type);
        initLessonIdRef.current = true;
      }
      return;
    }

    const first = data.body.lessons[0];
    if (!first) return;
    useVideoPlayerStore.getState().setCurrentTime(0);
    useVideoPlayerStore.getState().setIsPlaying(false);

    if (first.video_type === "youtube") {
      setVideoUrl(first.video_link);
    } else {
      setVideoId(first.video_id);
    }

    setLessonId(first.id);
    setSelectedVideoType(first.video_type);
    initLessonIdRef.current = true;
  }, [data, videoId, videoUrl, setVideoUrl, setVideoId]);

  return {
    otpData,
    otpStatus,
    lessonId,
    videoCompleted,
    selectedLesson,
    handleLessonSelect,
    isLoadingLesson,
    lessonData: data,
    videoUrl,
    videoId,
    selectedVideoType,
  };
}

export default useLessonRoomLogic;
