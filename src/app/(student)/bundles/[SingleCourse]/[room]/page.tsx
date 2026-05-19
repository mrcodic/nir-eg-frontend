"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuthContext } from "@/context/auth-context";
import useLessonRoomLogic from "@/hooks/useLessonRoomLogic";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import RoomSideContent from "@/modules/rooms/components/RoomSideContent";
import DisableDevTools from "@/modules/video/components/DisableDivTools";
import VideoBanners from "@/components/banners/VideoBanners";
import VideoError from "@/modules/video/components/VideoError";
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
const VideoBunny = dynamic(
  () => import("@/modules/video/components/VideoBunny"),
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

  const communityAvailable =
    profile?.type !== 3 &&
    !(lockedToPass || !!lockedByViewLimit) &&
    !!selectedLesson?.access_comment;

  return (
    <>
      <ProtectedRoute
        subscribed={lessonData?.body?.is_subscriped}
        data={lessonData}
        isLoading={isLoadingLesson}
      >
        <div className="wrapper mt-[110px]">
          <div className="flex flex-col-reverse gap-6 py-8 lg:flex-row">
            <div className="flex w-full lg:w-[min(35%,400px)]">
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
                <VideoBanners
                  requiresOtpVideo={requiresOtpVideo}
                  viewCount={viewCount}
                  lockedByViewLimit={lockedByViewLimit}
                  lockedToPass={lockedToPass}
                />

                <div className="border-primary-50 min-h-[520px] overflow-hidden rounded-lg border">
                  <Suspense
                    fallback={
                      <LoadingSpinner className="h-fit min-h-[520px] bg-white" />
                    }
                  >
                    {otpStatus?.loading ? (
                      <LoadingSpinner className="h-fit min-h-[520px] bg-white" />
                    ) : otpStatus?.error ? (
                      <VideoError
                        message={
                          lockedByViewLimit
                            ? "لقد تجاوزت الحد الأقصى لعدد المشاهدات المسموح بها لهذا الدرس"
                            : otpStatus?.message
                        }
                        src={lockedByViewLimit ? "/assets/Locked.png" : ""}
                      />
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
                        communityAvailable={communityAvailable}
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
                        communityAvailable={communityAvailable}
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
                {communityAvailable && (
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
