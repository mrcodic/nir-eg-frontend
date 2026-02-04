"use client";

import TooltipLock from "@/components/ToolTip";
import { convertMinutes } from "@/utils/clientFun";
import { Lock } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "./ui/button";

const LessonRoomCard = ({
  lesson,
  subscribe,
  verify,
  roomId,
  locked,
  classroomId,
}) => {
  const router = useRouter();

  return (
    <div className="border-gray-light bg-background flex items-start justify-between rounded-lg border p-2">
      <div className="flex items-center gap-4 pt-1">
        <img src="/assets/videos-fill.svg" className="size-6" />
        <div>
          <h3 className="text-sm font-bold text-[#121212] md:text-[16px]">
            {lesson?.title}
          </h3>
          {lesson?.description && (
            <p className="text-gray-dark mt-4 text-sm font-medium">
              {lesson?.description || "--"}
            </p>
          )}

          {lesson.duration && (
            <div className="mt-4 flex items-center gap-2 whitespace-nowrap">
              <img src="/assets/time.svg" className="size-6" />
              <div className="flex gap-1 text-black">
                <span className="inline-block text-sm font-bold">
                  مدة الفيديو:
                </span>

                <span className="text-sm font-medium">
                  {isFinite(Number(lesson.duration))
                    ? convertMinutes(Number(lesson.duration))
                    : lesson.duration || "--"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {subscribe && verify && (
        <Button
          disabled={locked}
          className="h-9 w-full max-w-32 cursor-pointer py-1"
          onClick={async () => {
            if (locked) return;

            router.push(
              `/bundles/${classroomId}/${roomId}?${
                lesson?.video_type === "youtube"
                  ? `video_url=${encodeURIComponent(lesson?.video_link)}`
                  : `video_id=${lesson?.vedio_id}`
              }`,
            );

            // if (SingleCourse) {
            //   router.push(
            //     `/bundles/${SingleCourse}/${roomId}?vedio_id=${lesson?.vedio_id}`,
            //   );
            // } else {
            //   router.push(
            //     `/bundles/${roomId}/${latestRoomId}?vedio_id=${lesson?.video_id}`,
            //   );
            // }
          }}
        >
          {!locked ? (
            <>
              <span className="hidden md:block">شاهد الفيديو</span>
              <img
                src="/assets/LeftArrowColor.svg"
                alt=""
                className="size-6 md:hidden"
              />
            </>
          ) : (
            <TooltipLock text="عليك اجتياز الاختبار أولا">
              <Lock className="size-6!" />
            </TooltipLock>
          )}
        </Button>
      )}
    </div>
  );
};
export default LessonRoomCard;
