"use client";

import RoomViewLimitBanner from "@/components/RoomViewLimitBanner";
import SelectedLesson from "@/components/SelectedLesson";
import Video from "@/components/Video";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import Community from "@/modules/community/components/Community";
import { ApiResponse, IRoomDetails } from "@/types";
import DisableDevTools from "@/utils/DisableDivTools";
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
  }, [videoId]);

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
              <SelectedLesson
                data={data?.body}
                videoId={videoId}
                sendData={handleLessonSelect}
                locked={data?.body?.locked_to_pass}
                // setLessonId={setLessonId}
                // setVideoId={setVideoId}
              />
            </div>

            <div className="flex-1 flex flex-col lg:w-[calc(70%-1.5rem)] ">
              <div className="relative">
                {viewCount && <RoomViewLimitBanner viewCount={viewCount} />}

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
                  // ref={communityRef}
                  // iframeRef={iframeRef}
                />
              </div>

              {(profile?.type === 4 || profile?.type === 5) &&
                !(data?.body?.locked_to_pass || lockedByViewLimit) && (
                  <Community
                    key={lessonId}
                    currentTime={currentTime}
                    locked={data?.body?.locked_to_pass || lockedByViewLimit}
                    lessonId={lessonId || data?.body?.lessons?.[0]?.id}
                    // ref={communityRef}
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
