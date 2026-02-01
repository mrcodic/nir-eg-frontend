"use client";

import TopBanner from "@/components/banners/TopBanner";
import LockedToPassVideoUI from "@/components/LockedToPassVideoUI";
import RoomSideContent from "@/components/RoomSideContent";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import Community from "@/modules/community/components/Community";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import Video from "@/modules/video/components/Video";
import { ApiResponse, IRoomDetails } from "@/types";
import { normalizeYouTubeUrl } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { redirect, useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";

const SingleVideo = () => {
  const { SingleCourse: classroomId, room } = useParams();

  const [otpData, setOtpData] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [lockedByViewLimit, setLockedByViewLimit] = useState(false);
  const [viewCount, setViewCount] = useState(null);
  const [lessonId, setLessonId] = useState(null);

  const { profile } = useAuthContext();

  const [videoId, setVideoId] = useQueryState("video_id", {
    defaultValue: "",
    history: "push",
    shallow: true,
    clearOnDefault: true,
  });

  const [videoUrl, setVideoUrl] = useQueryState("video_url", {
    defaultValue: "",
    history: "push",
    shallow: true,
    clearOnDefault: true,
    parse: (v) => decodeURIComponent(v),
    serialize: (v) => encodeURIComponent(v),
  });

  const hasVideoId =
    videoId && videoId !== "" && videoId !== "null" && videoId !== "undefined";

  const { data, isLoading } = useQuery({
    queryFn: getClientPrivateData as () => Promise<ApiResponse<IRoomDetails>>,
    queryKey: [`/students/get-lessons/${room}?classroom_id=${classroomId}`],
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
      setViewCount(null);
      setLockedByViewLimit(false);
      setOtpData(null);
      setCurrentTime(0);
      setOtpError(false);
    },
    [lessonId, setVideoId, setVideoUrl],
  );

  const fetchOtpAndViews = useCallback(
    async (vid) => {
      try {
        setOtpError(false);
        const res = await axios.post("/api?url=video/otp", {
          video_id: vid,
          classroom_id: classroomId,
          room_id: room,
        });

        if (res.data?.views_used >= res.data?.total_views) {
          setLockedByViewLimit(true);
          return;
        }

        setOtpData({
          otp: res.data?.otp,
          playbackInfo: res.data?.playbackInfo,
        });

        setViewCount({
          used: res.data?.views_used,
          remaining: res.data?.views_remaining,
          total_views: res.data?.total_views,
        });
      } catch (error) {
        console.error("❌ OTP fetch failed", error);
        setOtpError(true);
        if (error?.response?.status === 403) {
          setLockedByViewLimit(true);
        }
      }
    },
    [classroomId, room],
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

  if (
    data?.body?.is_subscriped &&
    data?.body &&
    "lessons" in data?.body &&
    data?.body?.lessons?.length === 0
  ) {
    redirect(`/bundles/${classroomId}`);
  }

  // console.log("lessons : ", data?.body?.lessons);

  return (
    <>
      <ProtectedRoute
        subscribed={data?.body?.is_subscriped}
        data={data}
        isLoading={isLoading}
      >
        <div className="wrapper mt-[110px]">
          <div className="flex flex-col-reverse gap-6 py-8 lg:flex-row">
            <div className="flex w-full lg:w-[30%]">
              <RoomSideContent
                data={data?.body}
                videoId={videoId}
                videoUrl={videoUrl}
                onLessonClick={handleLessonSelect}
                locked={data?.body?.locked_to_pass}
              />
            </div>

            <div className="flex flex-1 flex-col lg:w-[calc(70%-1.5rem)]">
              <div className="relative">
                {videoId && viewCount && (
                  <TopBanner
                    render={
                      <p className="text-sm">
                        عدد المشاهدات المسموح هو{" "}
                        <strong>{viewCount.total_views}</strong>، متبقي لك{" "}
                        <strong>{viewCount.remaining}</strong> مشاهدة ويتم
                        احتساب المشاهدة بعد اول 15 دقيقة في الفيديو.
                      </p>
                    }
                  />
                )}

                {videoUrl ? (
                  data?.body?.locked_to_pass ? (
                    <LockedToPassVideoUI
                      message={"يجب ان تقوم باجتياز الاختبار أولا"}
                    />
                  ) : (
                    <iframe
                      src={normalizeYouTubeUrl(videoUrl)}
                      className="h-[520px] w-full"
                      style={{ border: 0 }}
                      allow="encrypted-media"
                      allowFullScreen
                    />
                  )
                ) : (
                  <Video
                    videoId={videoId}
                    roomId={Number(room)}
                    setCurrentTime={setCurrentTime}
                    classroomId={Number(classroomId)}
                    locked={data?.body?.locked_to_pass || lockedByViewLimit}
                    response={otpData}
                    otpLoading={otpLoading}
                    otpError={otpError}
                    lessonId={lessonId || data?.body?.lessons?.[0]?.id}
                    videoCompleted={videoCompleted}
                    exceededViews={lockedByViewLimit}
                  />
                )}
              </div>

              <div className="border-gray-light mt-4 rounded-lg border p-2">
                <h2 className="text-lg font-bold">{selectedLesson?.title}</h2>
                <hr className="border-gray-light my-2" />
                <p className="text-gray-dark text-xs font-bold">
                  {data?.body?.room?.grade?.title || "--"}
                </p>
              </div>

              {(profile?.type === 4 || profile?.type === 5) &&
                !(!!data?.body?.locked_to_pass || !!lockedByViewLimit) && (
                  <Community
                    key={lessonId}
                    currentTime={currentTime}
                    locked={data?.body?.locked_to_pass || lockedByViewLimit}
                    lessonId={lessonId || data?.body?.lessons?.[0]?.id}
                    isYoutubeVideo={!!videoUrl}
                  />
                )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
      <DisableDevTools />
    </>
  );
};

export default SingleVideo;
