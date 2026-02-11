"use client";

import TopBanner from "@/components/banners/TopBanner";
import LockedToPassVideoUI from "@/components/LockedToPassVideoUI";
import RoomSideContent from "@/components/RoomSideContent";
import { useAuthContext } from "@/context/auth-context";
import useLessonRoomLogic from "@/hooks/useLessonRoomLogic";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import YoutubeVideoPlayer from "@/modules/video/components/YoutubeVideoPlayer";
import dynamic from "next/dynamic";
import { redirect, useParams } from "next/navigation";
import { Suspense } from "react";

const Community = dynamic(
  () => import("@/modules/community/components/Community"),
  {
    ssr: false,
  },
);
const Video = dynamic(() => import("@/modules/video/components/Video"), {
  ssr: false,
});

const SingleVideo = () => {
  const { SingleCourse: classroomId, room } = useParams();

  const { profile } = useAuthContext();

  const {
    lessonData,
    isLoadingLesson,
    lessonId,
    handleLessonSelect,
    videoCompleted,
    selectedLesson,
    otpData,
    setCurrentTime,
    currentTime,
    videoId,
    videoUrl,
    otpStatus,
  } = useLessonRoomLogic({
    classroomId: classroomId?.toString(),
    roomId: room?.toString(),
  });

  if (
    lessonData?.body?.is_subscriped &&
    lessonData?.body &&
    "lessons" in lessonData?.body &&
    lessonData?.body?.lessons?.length === 0
  ) {
    redirect(`/bundles/${classroomId}`);
  }

  const isCenterStudent = profile?.type === 3;
  const viewCount = otpData?.viewsStats;
  const lockedByViewLimit = otpData?.locakedByViewLimit;

  // console.log("lessons : ", data?.body?.lessons);

  return (
    <>
      <ProtectedRoute
        subscribed={lessonData?.body?.is_subscriped}
        data={lessonData}
        isLoading={isLoadingLesson}
      >
        <div className="wrapper mt-[110px]">
          <div className="flex flex-col-reverse gap-6 py-8 lg:flex-row">
            <div className="flex w-full lg:w-[30%]">
              <RoomSideContent
                data={lessonData?.body}
                videoId={videoId}
                videoUrl={videoUrl}
                onLessonClick={handleLessonSelect}
                locked={lessonData?.body?.locked_to_pass}
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

                <Suspense fallback={<div className="h-[520px] w-full" />}>
                  {videoUrl ? (
                    lessonData?.body?.locked_to_pass ? (
                      <LockedToPassVideoUI />
                    ) : (
                      <YoutubeVideoPlayer videoUrl={videoUrl} />
                    )
                  ) : (
                    <Video
                      videoId={videoId}
                      roomId={Number(room)}
                      setCurrentTime={setCurrentTime}
                      classroomId={Number(classroomId)}
                      locked={
                        lessonData?.body?.locked_to_pass || lockedByViewLimit
                      }
                      response={otpData}
                      otpLoading={otpStatus?.loading}
                      otpError={otpStatus?.error}
                      lessonId={lessonId || lessonData?.body?.lessons?.[0]?.id}
                      videoCompleted={videoCompleted}
                      exceededViews={lockedByViewLimit}
                    />
                  )}
                </Suspense>
              </div>

              <div className="border-gray-light mt-4 rounded-lg border p-2">
                <h2 className="text-lg font-bold">{selectedLesson?.title}</h2>
                <hr className="border-gray-light my-2" />
                <p className="text-gray-dark text-xs font-bold">
                  {lessonData?.body?.room?.grade?.title || "--"}
                </p>
              </div>

              <Suspense fallback={null}>
                {!isCenterStudent &&
                  !(
                    !!lessonData?.body?.locked_to_pass || !!lockedByViewLimit
                  ) &&
                  !!selectedLesson?.access_comment && (
                    <Community
                      key={lessonId}
                      currentTime={currentTime}
                      locked={
                        lessonData?.body?.locked_to_pass || lockedByViewLimit
                      }
                      lessonId={lessonId || lessonData?.body?.lessons?.[0]?.id}
                      isYoutubeVideo={!!videoUrl}
                    />
                  )}
              </Suspense>
            </div>
          </div>
        </div>
      </ProtectedRoute>
      <DisableDevTools />
    </>
  );
};

export default SingleVideo;
