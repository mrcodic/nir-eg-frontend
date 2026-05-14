"use client";

import TopBanner from "@/components/banners/TopBanner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuthContext } from "@/context/auth-context";
import useLessonRoomLogic from "@/hooks/useLessonRoomLogic";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import RoomSideContent from "@/modules/rooms/components/RoomSideContent";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import VideoBunny from "@/modules/video/components/VideoBunny";
import VideoError from "@/modules/video/components/VideoError";
import YoutubeVideoPlayer from "@/modules/video/components/YoutubeVideoPlayer";
import dynamic from "next/dynamic";
import Image from "next/image";
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
    lessonData?.body?.lessons?.length === 0
  ) {
    redirect(`/bundles/${classroomId}`);
  }

  const viewCount = otpData?.viewsStats;
  const lockedByViewLimit = otpData?.lockedByViewLimit;
  const lockedToPass = !!lessonData?.body?.locked_to_pass;
  const activeVideoType = selectedVideoType ?? (videoUrl ? "youtube" : null);
  const requiresOtpVideo =
    activeVideoType === "cipher" || activeVideoType === "bunny";

  console.log("selectedLesson", selectedLesson);

  console.log("otpStatus", otpStatus);
  console.log("otpData", otpData);

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

                {(lockedToPass || !!lockedByViewLimit) && (
                  <TopBanner
                    icon="/assets/warning-fill.svg"
                    render={
                      <p className="text-sm">
                        {otpData?.lockedMessage ||
                          (!!lockedByViewLimit
                            ? "لقد تجاوزت الحد الأقصى لعدد المشاهدات المسموح بها لهذا الدرس"
                            : "يجب ان تقوم باجتياز الاختبار أولا")}
                      </p>
                    }
                  />
                )}

                <div className="border-primary-50 overflow-hidden rounded-lg border">
                  <Suspense
                    fallback={
                      <LoadingSpinner className="h-fit min-h-[520px] bg-white" />
                    }
                  >
                    {otpStatus.error ? (
                      <div className="flex h-[520px] w-full flex-1 flex-col items-center justify-center gap-4 bg-gray-100">
                        <Image
                          src="/assets/Locked.png"
                          width={150}
                          height={150}
                          alt="Locked"
                        />
                        {otpStatus?.message && (
                          <p className="text-destructive text-lg">
                            {otpStatus.message}
                          </p>
                        )}
                      </div>
                    ) : otpStatus?.loading ? (
                      <LoadingSpinner className="h-fit min-h-[520px] bg-white" />
                    ) : otpStatus?.error ? (
                      <VideoError message={otpData?.lockedMessage} />
                    ) : activeVideoType === "youtube" && videoUrl ? (
                      <YoutubeVideoPlayer videoUrl={videoUrl} />
                    ) : activeVideoType === "bunny" && videoId ? (
                      <VideoBunny
                        key={videoId}
                        response={otpData}
                        videoId={videoId}
                        roomId={Number(room)}
                        classroomId={Number(classroomId)}
                        lessonId={
                          lessonId || lessonData?.body?.lessons?.[0]?.id
                        }
                        videoCompleted={videoCompleted}
                      />
                    ) : activeVideoType === "cipher" && videoId ? (
                      <VideoCipher
                        key={videoId}
                        videoId={videoId}
                        roomId={Number(room)}
                        classroomId={Number(classroomId)}
                        response={otpData}
                        lessonId={
                          lessonId || lessonData?.body?.lessons?.[0]?.id
                        }
                        videoCompleted={videoCompleted}
                      />
                    ) : (
                      <VideoError message={"لا يوجد فيديو متاح"} />
                    )}
                  </Suspense>
                </div>
              </div>

              <div className="border-gray-light mt-4 rounded-lg border p-2">
                <h2 className="text-lg font-bold">
                  {selectedLesson?.title || "--"}
                </h2>
                <hr className="border-gray-light my-2" />
                <p className="text-gray-dark text-xs font-bold">
                  {lessonData?.body?.room?.grade?.title || "--"}
                </p>
              </div>

              <Suspense fallback={null}>
                {profile?.type !== 3 &&
                  !(lockedToPass || !!lockedByViewLimit) &&
                  !!selectedLesson?.access_comment && (
                    <Community
                      key={lessonId}
                      locked={lockedToPass || !!lockedByViewLimit}
                      lessonId={lessonId || lessonData?.body?.lessons?.[0]?.id}
                      isYoutubeVideo={activeVideoType === "youtube"}
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
