"use client";

import TooltipLock from "@/components/ToolTip";
import { convertMinutes } from "@/utils/clientFun";
import { Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

const RoomRevision = ({
  lesson,
  disabled,
  subscribe,
  verify,
  roomId,
  latestRoomId,
  locked,
}) => {
  const { SingleCourse } = useParams();
  const router = useRouter();

  return (
    <div className="border flex mb-2 items-start justify-between border-primary-700 rounded-[8px] p-2 bg-white">
      <div className="flex gap-4 items-center">
        <img src="/assets/FillVideos.svg" className="w-7 h-7" />
        <div>
          <h3 className="text-[#121212] font-bold text-[14px] md:text-[16px] mb-4">
            {lesson?.title}
          </h3>
          <p className="text-[#454545] font-medium text-[14px] mb-4">
            {lesson?.description}
          </p>

          <div className="flex gap-2 items-center whitespace-nowrap ">
            <img src="/assets/Time.svg" />
            <div className="flex text-[#523412] gap-1">
              <span className="text-[14px]  font-bold inline-block">
                مدة الفيديو:
              </span>

              <span className="text-[14px] font-medium">
                {isFinite(Number(lesson.duration))
                  ? convertMinutes(Number(lesson.duration))
                  : lesson.duration}
              </span>
            </div>
          </div>
        </div>
      </div>
      {subscribe && verify && (
        <button
          disabled={locked}
          onClick={async () => {
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
          className="border flex justify-center min-w-[39px] text-center font-bold p-2 text-white border-primary-700 bg-color-primary text-[12px] rounded-[10px]"
        >
          {!locked ? (
            <>
              <span className="hidden md:block"> مشاهدة الفيديو</span>
              <img
                src="/assets/LeftArrowColor.svg"
                alt=""
                className="md:hidden"
              />
            </>
          ) : (
            <TooltipLock text="عليك اجتياز الاختبار أولا">
              <Lock />
            </TooltipLock>
          )}{" "}
        </button>
      )}
    </div>
  );
};
export default RoomRevision;
