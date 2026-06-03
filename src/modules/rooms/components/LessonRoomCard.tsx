"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ILesson } from "@/types";
import { convertMinutes } from "@/utils/clientFun";
import { Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";

type Props = {
  lesson: ILesson;
  subscribe: boolean;
  verify?: boolean;
  roomId: string | number;
  locked?: boolean;
  classroomId: string | number;
  className?: string;
};

const LessonRoomCard = ({
  lesson,
  subscribe,
  verify = true,
  roomId,
  locked,
  classroomId,
  className,
}: Props) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "border-gray-light bg-background flex items-start justify-between gap-2 rounded-lg border p-2 max-sm:flex-col",
        className,
      )}
    >
      <div className="flex gap-4 pt-1">
        <Image
          src="/assets/videos-fill.svg"
          width={24}
          height={24}
          alt="video icon"
          className="size-6"
        />

        <div>
          <h3 className="text-sm font-bold text-black md:text-base">
            {lesson?.title}
          </h3>
          {lesson?.description && (
            <p className="text-gray-dark mt-4 text-sm font-medium">
              {lesson?.description || "--"}
            </p>
          )}

          {lesson.duration && (
            <div className="mt-4 flex items-center gap-2 whitespace-nowrap">
              <Image
                src="/assets/time.svg"
                width={24}
                height={24}
                alt="time icon"
                className="size-6"
              />
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
          className="ms-auto h-9 w-full max-w-28 cursor-pointer py-1 max-sm:text-sm sm:max-w-32"
          onClick={async () => {
            if (locked) return;

            router.push(`/bundles/${classroomId}/${roomId}/${lesson?.id}`);
          }}
        >
          {!locked ? (
            <>
              <span>شاهد الفيديو</span>
              {/* <img
                src="/assets/LeftArrowColor.svg"
                alt=""
                className="size-6 md:hidden"
              /> */}
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lock className="size-5!" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>عليك اجتياز الاختبار أولا</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Button>
      )}
    </div>
  );
};
export default LessonRoomCard;
