"use client";

import dynamic from "next/dynamic";
import { redirect, useParams, useRouter } from "next/navigation";
import { Suspense } from "react";

import VideoBanners from "@/components/banners/VideoBanners";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuthContext } from "@/context/auth-context";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import LessonTimedQuiz from "@/modules/rooms/components/LessonTimedQuiz";
import RoomSideContent from "@/modules/rooms/components/RoomSideContent";
import useLessonRoomLogic from "@/modules/rooms/hooks/useLessonRoomLogic";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import VideoError from "@/modules/video/components/VideoError";
import VideoNotPlayableOnWebsite from "@/modules/video/components/VideoNotPlayableOnWebsite";
import YoutubeVideoPlayer from "@/modules/video/components/YoutubeVideoPlayer";

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
const VideoBunny = dynamic(
  () => import("@/modules/video/components/VideoBunny"),
  {
    ssr: false,
  },
);

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();

  const classroomId = params.classroomId?.toString() ?? "";
  const room = params.room?.toString() ?? "";
  const lessonParamId = params.lessonId?.toString() ?? "";

  const { profile } = useAuthContext();

  const {
    roomDetails,
    isLoadingLesson,
    lessonId,
    videoCompleted,
    selectedLesson,
    otpData,
    videoId,
    videoUrl,
    otpStatus,
    selectedVideoType,
  } = useLessonRoomLogic({
    classroomId,
    roomId: room,
    lessonId: lessonParamId,
  });

  if (roomDetails?.is_subscriped && roomDetails?.lessons?.length === 0) {
    redirect(`/bundles/${classroomId}`);
  }

  const viewCount = otpData?.viewsStats;
  const lockedByViewLimit = otpData?.lockedByViewLimit;
  const lockedToPass = !!roomDetails?.locked_to_pass;
  const activeVideoType = selectedVideoType ?? (videoUrl ? "youtube" : null);
  const requiresOtpVideo =
    activeVideoType === "cipher" || activeVideoType === "bunny";

  const isWebPlayable =
    activeVideoType === "youtube" ||
    selectedLesson?.video_target === "web" ||
    selectedLesson?.video_target === "both";

  const communityAvailable =
    profile?.type !== 3 &&
    !(lockedToPass || !!lockedByViewLimit) &&
    !!selectedLesson?.access_comment;

  console.log("lesson data", selectedLesson);
  return (
    <>
      <ProtectedRoute
        subscribed={roomDetails?.is_subscriped}
        data={roomDetails}
        isLoading={isLoadingLesson}
        emptyMessage="لم يتم العثور على بيانات هذه الحصة"
      >
        {selectedLesson && requiresOtpVideo && (
          <LessonTimedQuiz lessonData={selectedLesson} />
        )}

        <div className="wrapper mt-[110px]">
          <div className="flex flex-col-reverse gap-6 py-8 lg:flex-row">
            <div className="flex w-full lg:w-[min(35%,400px)]">
              <RoomSideContent
                data={roomDetails}
                locked={lockedToPass}
                isLoading={isLoadingLesson}
                activeLessonId={lessonId ?? undefined}
                onLessonClick={(url) => router.replace(url)}
              />
            </div>

            <div className="flex flex-1 flex-col lg:w-[calc(70%-1.5rem)]">
              <div className="relative">
                {isWebPlayable && (
                  <VideoBanners
                    requiresOtpVideo={requiresOtpVideo}
                    viewCount={viewCount}
                    lockedByViewLimit={lockedByViewLimit}
                    lockedToPass={lockedToPass}
                  />
                )}

                <div
                  className={cn(
                    "border-gray-light h-[300px] overflow-hidden rounded-lg border sm:h-[520px]",
                    {
                      "h-auto sm:h-auto": !isWebPlayable,
                    },
                  )}
                >
                  <Suspense
                    fallback={
                      <LoadingSpinner className="h-[300px] bg-white sm:h-[520px]" />
                    }
                  >
                    {otpStatus?.loading ? (
                      <LoadingSpinner className="h-[300px] bg-white sm:h-[520px]" />
                    ) : otpStatus?.error ? (
                      <VideoError
                        message={
                          lockedByViewLimit
                            ? "لقد تجاوزت الحد الأقصى لعدد المشاهدات المسموح بها لهذا الدرس"
                            : otpStatus?.message
                        }
                        src={lockedByViewLimit ? "/assets/lock.png" : ""}
                      />
                    ) : !isWebPlayable ? (
                      <VideoNotPlayableOnWebsite />
                    ) : activeVideoType === "youtube" && videoUrl ? (
                      <YoutubeVideoPlayer videoUrl={videoUrl} />
                    ) : activeVideoType === "bunny" && videoId ? (
                      <VideoBunny
                        key={videoId}
                        response={otpData}
                        videoId={videoId}
                        roomId={Number(room)}
                        classroomId={Number(classroomId)}
                        lessonId={lessonId || roomDetails?.lessons?.[0]?.id}
                        videoCompleted={videoCompleted}
                        communityAvailable={communityAvailable}
                      />
                    ) : activeVideoType === "cipher" && videoId ? (
                      <VideoCipher
                        key={videoId}
                        videoId={videoId}
                        roomId={Number(room)}
                        classroomId={Number(classroomId)}
                        response={otpData}
                        lessonId={lessonId || roomDetails?.lessons?.[0]?.id}
                        videoCompleted={videoCompleted}
                        communityAvailable={communityAvailable}
                      />
                    ) : (
                      <VideoError message="لا يوجد فيديو متاح" />
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
                  {selectedLesson?.description || selectedLesson?.grade || "--"}
                </p>
              </div>

              <Suspense fallback={null}>
                {communityAvailable && (
                  <Community
                    key={lessonId}
                    locked={lockedToPass || !!lockedByViewLimit}
                    lessonId={lessonId || roomDetails?.lessons?.[0]?.id}
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
}
