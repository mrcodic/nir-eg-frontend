import { getClientPrivateData } from "@/helpers/client-fetch";
import { mutateClient } from "@/helpers/post-client";
import { ApiResponse, IRoomDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";

const initOtpStatus = {
  error: false,
  loading: false,
};

function useLessonRoomLogic({
  classroomId,
  roomId,
}: {
  classroomId: string;
  roomId: string;
}) {
  const [otpData, setOtpData] = useState(null);
  const [otpStatus, setOtpStatus] = useState(initOtpStatus);
  const [currentTime, setCurrentTime] = useState(0);
  const [lessonId, setLessonId] = useState(null);

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

  const videoCompleted = useMemo(() => {
    return (
      videoId &&
      data?.body?.lessons?.find((lesson) => lesson?.vedio_id === videoId)
        ?.completed
    );
  }, [data, videoId]);

  const selectedLesson = useMemo(
    () => data?.body?.lessons?.find((lesson) => lesson.id === lessonId),
    [data?.body?.lessons, lessonId],
  );

  const handleLessonSelect = useCallback(
    (vid: string, lessId: number, type: string) => {
      if (lessId === lessonId) return;

      if (type === "youtube") {
        setVideoUrl(vid);
        setVideoId(null);
      } else {
        setVideoId(vid);
        setVideoUrl(null);
      }

      setLessonId(lessId);
      setOtpData(null);
      setCurrentTime(0);

      setOtpStatus(initOtpStatus);
    },
    [lessonId, setVideoId, setVideoUrl],
  );

  const fetchOtpAndViews = useCallback(
    async (vid) => {
      setOtpStatus({
        loading: true,
        error: false,
      });
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
          playbackInfo: res?.playbackInfo,
          viewsStats: {
            used: res?.views_used,
            remaining: res?.views_remaining,
            total_views: res?.total_views,
          },
          locakedByViewLimit: res?.views_used >= res?.total_views,
        });
      } catch (error) {
        console.error("❌ OTP fetch failed", error);
        setOtpStatus({
          loading: false,
          error: true,
        });
        if (error?.response?.status === 403) {
          setOtpData({
            locakedByViewLimit: true,
          });
        }
      } finally {
        // setOtpLoading(false);
        setOtpStatus({
          loading: false,
          error: false,
        });
      }
    },
    [classroomId, roomId],
  );

  useEffect(() => {
    if (hasVideoId && !otpData) {
      fetchOtpAndViews(videoId);
    }
  }, [fetchOtpAndViews, otpData, videoId, hasVideoId]);

  // initialize lesson id and video id from video id searchparam
  useEffect(() => {
    if (!data) return;

    if (lessonId && (videoId || videoUrl)) return;

    console.log(videoId, videoUrl, lessonId);
    if (videoId) {
      const lesson = data.body.lessons.find((l) => l.vedio_id === videoId);
      if (lesson) setLessonId(lesson.id);
      return;
    }

    if (videoUrl) {
      const lesson = data.body.lessons.find((l) => l.video_link === videoUrl);
      if (lesson) setLessonId(lesson.id);
      return;
    }

    // fallback → first lesson
    const first = data.body.lessons[0];
    if (!first) return;

    if (first.video_type === "youtube") {
      setVideoUrl(first.video_link);
    } else {
      setVideoId(first.vedio_id);
    }

    setLessonId(first.id);
  }, [data, videoId, videoUrl, lessonId, setVideoUrl, setVideoId]);

  return {
    otpData,
    otpStatus,
    currentTime,
    lessonId,
    setCurrentTime,
    videoCompleted,
    selectedLesson,
    handleLessonSelect,
    isLoadingLesson,
    lessonData: data,
    videoUrl,
    videoId,
  };
}

export default useLessonRoomLogic;
