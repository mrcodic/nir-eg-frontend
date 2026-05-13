"use client";

import TopBanner from "@/components/banners/TopBanner";
import LockedToPassVideoUI from "@/modules/video/components/LockedToPassVideoUI";
import RoomSideContent from "@/modules/rooms/components/RoomSideContent";
import { useAuthContext } from "@/context/auth-context";
import useLessonRoomLogic from "@/hooks/useLessonRoomLogic";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import VideoBunny from "@/modules/video/components/VideoBunny";
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
const VideoCipher = dynamic(
  () => import("@/modules/video/components/VideoCipher"),
  {
    ssr: false,
  },
);

const RoomLecturePage = () => {
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
    selectedVideoType,
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
  const lockedByViewLimit = otpData?.lockedByViewLimit;
  const lockedToPass = !!lessonData?.body?.locked_to_pass;
  const activeVideoType = selectedVideoType ?? (videoUrl ? "youtube" : null);
  const isCipherVideo = activeVideoType === "cipher";
  const requiresOtpVideo =
    activeVideoType === "cipher" || activeVideoType === "bunny";

  console.log("selectedLesson", selectedLesson);

  return (
    <>
      <ProtectedRoute
        subscribed={lessonData?.body?.is_subscriped}
        data={lessonData}
        isLoading={isLoadingLesson}
      >
        <div className="wrapper mt-[110px]">
          <div className="flex flex-col-reverse gap-6 py-8 lg:flex-row">
            <div className="flex w-full lg:w-[35%]">
              <RoomSideContent
                data={lessonData?.body}
                videoId={videoId}
                videoUrl={videoUrl}
                onLessonClick={handleLessonSelect}
                locked={lessonData?.body?.locked_to_pass}
                isLoading={isLoadingLesson}
                activeLessonId={lessonId}
              />
            </div>

            <div className="flex flex-1 flex-col lg:w-[calc(70%-1.5rem)]">
              <div className="relative">
                {requiresOtpVideo && viewCount && (
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
                  {lockedToPass || !!lockedByViewLimit ? (
                    <LockedToPassVideoUI exceededViews={!!lockedByViewLimit} />
                  ) : activeVideoType === "youtube" && videoUrl ? (
                    <YoutubeVideoPlayer videoUrl={videoUrl} />
                  ) : activeVideoType === "bunny" && videoId ? (
                    <VideoBunny
                      key={videoId}
                      response={otpData}
                      otpLoading={otpStatus?.loading || !otpData}
                      otpError={otpStatus?.error}
                    />
                  ) : activeVideoType === "cipher" ? (
                    <VideoCipher
                      key={videoId}
                      videoId={videoId}
                      roomId={Number(room)}
                      setCurrentTime={setCurrentTime}
                      classroomId={Number(classroomId)}
                      response={otpData}
                      otpLoading={otpStatus?.loading || !otpData}
                      otpError={otpStatus?.error}
                      lessonId={lessonId || lessonData?.body?.lessons?.[0]?.id}
                      videoCompleted={videoCompleted}
                    />
                  ) : (
                    <div className="flex h-[520px] w-full items-center justify-center rounded-xl bg-gray-100">
                      <p className="text-gray-dark text-sm font-bold">
                        لا يوجد فيديو متاح
                      </p>
                    </div>
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
                  !(lockedToPass || !!lockedByViewLimit) &&
                  !!selectedLesson?.access_comment && (
                    <Community
                      key={lessonId}
                      currentTime={currentTime}
                      locked={lockedToPass || !!lockedByViewLimit}
                      lessonId={lessonId || lessonData?.body?.lessons?.[0]?.id}
                      isYoutubeVideo={!isCipherVideo}
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

export default RoomLecturePage;
