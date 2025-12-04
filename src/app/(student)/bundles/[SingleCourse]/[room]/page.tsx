"use client";

import TopBanner from "@/components/banners/TopBanner";
import RoomSideContent from "@/components/RoomSideContent";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import Community from "@/modules/community/components/Community";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import Video from "@/modules/video/components/Video";
import { ApiResponse, IRoomDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const SingleVideo = () => {
  const { SingleCourse: classroomId, room } = useParams();
  const searchParams = useSearchParams();

  const [otpData, setOtpData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [lockedByViewLimit, setLockedByViewLimit] = useState(false);
  const [viewCount, setViewCount] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [lessonId, setLessonId] = useState(null);

  const { profile } = useAuthContext();

  const { data, isLoading } = useQuery({
    queryFn: getClientPrivateData as () => Promise<ApiResponse<IRoomDetails>>,
    queryKey: [`/students/get-lessons/${room}`],
  });

  const videoCompleted = useMemo(() => {
    return data?.body?.lessons?.find((lesson) => lesson?.vedio_id === videoId)
      ?.completed;
  }, [data, videoId]);

  const handleLessonSelect = useCallback(
    (vid, lessId) => {
      if (vid === videoId && lessId === lessonId) return;

      setVideoId(vid);
      setLessonId(lessId);
      setViewCount(null);
      setLockedByViewLimit(false);
      setOtpData(null);
      setCurrentTime(0);
      setOtpError(false);
    },
    [videoId, lessonId]
  );

  const fetchOtpAndViews = async (vid) => {
    try {
      setOtpError(false);
      const res = await axios.post("/api?url=video/otp", { video_id: vid });

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
  };

  useEffect(() => {
    if (videoId && !otpData) {
      console.log("fetching otp and views");
      fetchOtpAndViews(videoId);
    }
  }, [otpData, videoId]);

  // initialize lesson id and video id from video id searchparam
  useEffect(() => {
    if (!data || lessonId) return;

    const initialVideoId = searchParams.get("vedio_id");

    if (
      initialVideoId &&
      initialVideoId !== "null" &&
      initialVideoId !== "undefined"
    ) {
      console.log("init from search--------------------");
      setVideoId(initialVideoId);
      const lesson = data?.body?.lessons?.find(
        (les) => les.vedio_id === initialVideoId
      );
      if (lesson) {
        setLessonId(lesson.id);
      }
    } else {
      console.log("init default--------------------");
      setVideoId(data?.body?.lessons?.[0]?.vedio_id);
      setLessonId(data?.body?.lessons?.[0]?.id);
    }
  }, [data]);

  const selectedLesson = useMemo(
    () => data?.body?.lessons?.find((lesson) => lesson.id === lessonId),
    [lessonId]
  );

  // console.log("selected lessonId : ", lessonId);
  console.log("all lessons : ", data?.body, isLoading);

  if (
    data?.body?.is_subscriped &&
    data?.body &&
    "lessons" in data?.body &&
    data?.body?.lessons?.length === 0
  ) {
    redirect(`/bundles/${classroomId}`);
  }

  return (
    <>
      <ProtectedRoute
        subscribed={data?.body?.is_subscriped}
        verify={data?.body?.parent_phone_verification}
        data={data}
        isLoading={isLoading}
      >
        <div className="wrapper mt-[110px]">
          <div className="flex flex-col-reverse lg:flex-row py-8 gap-6">
            <div className="w-full flex lg:w-[30%] ">
              <RoomSideContent
                data={data?.body}
                videoId={videoId}
                onLessonClick={(videoId, lessonId) => {
                  if (data?.body?.locked_to_pass) return;
                  handleLessonSelect(videoId, lessonId);
                }}
                locked={data?.body?.locked_to_pass}
              />
            </div>

            <div className="flex-1 flex flex-col lg:w-[calc(70%-1.5rem)] ">
              <div className="relative">
                {viewCount && (
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

                <Video
                  videoId={videoId}
                  roomId={Number(room)}
                  setCurrentTime={setCurrentTime}
                  classroomId={Number(classroomId)}
                  response={otpData}
                  locked={data?.body?.locked_to_pass || lockedByViewLimit}
                  lessonId={lessonId || data?.body?.lessons?.[0]?.id}
                  videoCompleted={videoCompleted}
                  exceededViews={lockedByViewLimit}
                  otpError={otpError}
                />
              </div>

              <div className="border border-gray-light rounded-lg p-2 mt-4">
                <h2 className="text-lg font-bold">{selectedLesson?.title}</h2>
                <hr className="border-gray-light my-2" />
                <p className="text-xs font-bold text-gray-dark">
                  {data?.body?.room?.grade?.title || "--"}
                </p>
              </div>

              {(profile?.type === 4 || profile?.type === 5) &&
                !(data?.body?.locked_to_pass || lockedByViewLimit) && (
                  <Community
                    key={lessonId}
                    currentTime={currentTime}
                    locked={data?.body?.locked_to_pass || lockedByViewLimit}
                    lessonId={lessonId || data?.body?.lessons?.[0]?.id}
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
