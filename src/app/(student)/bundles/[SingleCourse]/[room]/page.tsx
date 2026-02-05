"use client";

import TopBanner from "@/components/banners/TopBanner";
import LockedToPassVideoUI from "@/components/LockedToPassVideoUI";
import RoomSideContent from "@/components/RoomSideContent";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { mutateClient } from "@/helpers/post-client";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import Video from "@/modules/video/components/Video";
import { ApiResponse, IRoomDetails } from "@/types";
import { normalizeYouTubeUrl } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { redirect, useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

const Community = dynamic(
  () => import("@/modules/community/components/Community"),
  {
    ssr: false,
  },
);

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
    history: "replace",
    shallow: true,
    clearOnDefault: true,
    // convert undefined and null to default value
    parse: (v) => (v === "undefined" || v === "null" ? "" : v),
    serialize: (v) => (v === "undefined" || v === "null" ? "" : v),
  });

  const [videoUrl, setVideoUrl] = useQueryState("video_url", {
    defaultValue: "",
    history: "replace",
    shallow: true,
    clearOnDefault: true,
    // convert undefined and null to default value otherwise decodeURIComponent
    parse: (v) =>
      v === "undefined" || v === "null" ? "" : decodeURIComponent(v),
    serialize: (v) =>
      v === "undefined" || v === "null" ? "" : encodeURIComponent(v),
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
      setOtpLoading(false);
      setOtpError(false);
    },
    [lessonId, setVideoId, setVideoUrl],
  );

  const fetchOtpAndViews = useCallback(
    async (vid) => {
      setOtpLoading(true);
      try {
        setOtpError(false);

        const res = await mutateClient("/video/otp", {
          body: {
            video_id: vid,
            classroom_id: classroomId,
            room_id: room,
          },
        });

        if (res?.views_used >= res?.total_views) {
          setLockedByViewLimit(true);
          return;
        }

        setOtpData({
          otp: res?.otp,
          playbackInfo: res?.playbackInfo,
        });

        setViewCount({
          used: res?.views_used,
          remaining: res?.views_remaining,
          total_views: res?.total_views,
        });
      } catch (error) {
        console.error("❌ OTP fetch failed", error);
        setOtpError(true);
        if (error?.response?.status === 403) {
          setLockedByViewLimit(true);
        }
      } finally {
        setOtpLoading(false);
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

  if (
    data?.body?.is_subscriped &&
    data?.body &&
    "lessons" in data?.body &&
    data?.body?.lessons?.length === 0
  ) {
    redirect(`/bundles/${classroomId}`);
  }

  const isCenterStudent = profile?.type === 3;
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

              {!isCenterStudent &&
                !(!!data?.body?.locked_to_pass || !!lockedByViewLimit) &&
                !!selectedLesson?.access_comment && (
                  <Suspense fallback={null}>
                    <Community
                      key={lessonId}
                      currentTime={currentTime}
                      locked={data?.body?.locked_to_pass || lockedByViewLimit}
                      lessonId={lessonId || data?.body?.lessons?.[0]?.id}
                      isYoutubeVideo={!!videoUrl}
                    />
                  </Suspense>
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
