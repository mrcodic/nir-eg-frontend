"use client";

import TooltipLock from "@/components/ToolTip";
import { convertMinutes } from "@/utils/clientFun";
import { Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "./ui/button";

const RoomRevision = ({
  lesson,
  subscribe,
  verify,
  roomId,
  latestRoomId,
  locked,
}) => {
  const { SingleCourse } = useParams();
  const router = useRouter();

  return (
    <div className="border flex mb-2 items-start justify-between border-gray-light rounded-lg p-2 bg-background">
      <div className="flex gap-4 items-center">
        <img src="/assets/videos-fill.svg" className="w-7 h-7" />
        <div>
          <h3 className="text-[#121212] font-bold text-sm md:text-[16px] mb-4">
            {lesson?.title}
          </h3>
          <p className="text-gray-dark font-medium text-sm mb-4">
            {lesson?.description}
          </p>

          <div className="flex gap-2 items-center whitespace-nowrap ">
            <img src="/assets/time.svg" />
            <div className="flex text-[#523412] gap-1">
              <span className="text-sm  font-bold inline-block">
                مدة الفيديو:
              </span>

              <span className="text-sm font-medium">
                {isFinite(Number(lesson.duration))
                  ? convertMinutes(Number(lesson.duration))
                  : lesson.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      {subscribe && verify && (
        <Button
          disabled={locked}
          className="h-9 py-1 cursor-pointer max-w-32 w-full"
          onClick={async () => {
            if (locked) return;
            // await sendData(lesson?.vedio_id);
            if (SingleCourse) {
              router.push(
                `/bundles/${SingleCourse}/${roomId}?vedio_id=${lesson?.vedio_id}`
              );
            } else {
              router.push(
                `/bundles/${roomId}/${latestRoomId}?vedio_id=${lesson?.video_id}`
              );
            }
          }}
        >
          {!locked ? (
            <>
              <span className="hidden md:block">شاهد الفيديو</span>
              <img
                src="/assets/LeftArrowColor.svg"
                alt=""
                className="md:hidden"
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
export default RoomRevision;
