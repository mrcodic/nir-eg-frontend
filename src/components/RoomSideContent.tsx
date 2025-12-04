"use client";

import LinkLocked from "@/layouts/LinkLocked";
import { cn } from "@/lib/utils";
import { IRoomDetails } from "@/types";
import { convertMinutes } from "@/utils/clientFun";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { memo } from "react";
import MarkVideoCompleted from "./MarkVideoCompleted";
import { Button } from "./ui/button";

type RoomSideContentProps = {
  data: IRoomDetails;
  onLessonClick?: (videoId?: string, lessonId?: string | number) => void;
  locked: boolean;
  videoId?: string;
  className?: string;
};

const RoomSideContent = ({
  data,
  onLessonClick,
  locked,
  videoId,
  className,
}: RoomSideContentProps) => {
  const { SingleCourse, room } = useParams();
  const router = useRouter();

  return (
    <div
      className={cn(
        "overflow-y-auto max-h-[max(calc(100vh-88px),768px)] w-full border border-gray-light rounded-lg p-4 h-fit sticky top-22",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <img
          src={"/assets/grade-placeholder.png"}
          className="size-16 rounded-lg"
        />

        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-[18px] text-[#121212] font-bold line-clamp-1">
            {data?.room?.title}
          </h1>

          <hr className="h-px w-full border-gray-light" />

          <p className="text-xs text-gray-dark">{data?.room?.grade?.title}</p>
        </div>
      </div>

      <Button
        onClick={() => {
          router.push(`/bundles/${SingleCourse}`);
        }}
        className="mt-6 w-full bg-white text-primary-800 [&>svg]:size-6 text-base font-bold border border-primary-800 py-2.5 h-11 hover:bg-primary-800 hover:text-white group"
      >
        <ChevronRight className="stroke-primary-800 group-hover:stroke-white" />
        <span>العودة للكورس</span>
      </Button>

      {data?.lessons?.map((lesson) => (
        <div
          key={lesson.id}
          onClick={async () => {
            if (locked) return;
            onLessonClick?.(lesson?.vedio_id, lesson?.id);
          }}
          className={`mt-4  border cursor-pointer ${
            videoId !== lesson?.vedio_id
              ? "border-[#1EAD7B]  bg-white"
              : "border-primary-800 bg-background"
          } rounded-lg mb-3 px-2  py-2`}
        >
          <div className="flex text-sm items-center font-bold gap-4">
            <img src="/assets/videos-fill.svg" className="size-6" />
            <h3 className="line-clamp-1">{lesson?.title}</h3>
          </div>

          <div className="mr-10 flex justify-between mt-2">
            <div className="flex items-center gap-2">
              <img className="size-5" src="/assets/time.svg" />
              <span className=" flex gap-1 text-xs font-medium">
                {isFinite(Number(lesson?.duration))
                  ? convertMinutes(Number(lesson.duration))
                  : lesson.duration}
              </span>
            </div>

            <MarkVideoCompleted
              isCompleted={lesson.completed}
              roomId={data?.room?.id}
              classroomId={SingleCourse as string}
              lessonId={lesson?.id}
            />
          </div>
        </div>
      ))}

      <div className="h-px w-full bg-gray-light my-4" />

      {!!data?.quizzes?.length && (
        <div>
          <h3 className="text-gray-dark text-sm font-bold">الامتحانات</h3>
          {data?.quizzes.map((quiz) => {
            return (
              <div
                key={quiz.id}
                className="flex items-center px-2 py-2 rounded-lg border border-gray-light shadow-sm bg-white mt-4 justify-between"
              >
                <div className="flex gap-2">
                  <img src="/assets/exam-fill.svg" className="size-6" />
                  <h3 className="text-sm font-bold truncate break-all">
                    {quiz?.title}
                  </h3>
                </div>

                <Link
                  href={`${room}/exams/${quiz.id}`}
                  className="flex items-center justify-center size-9 bg-primary-800 rounded-lg"
                >
                  <ChevronLeft className="stroke-white size-5" />
                </Link>
              </div>
            );
          })}
          <div className="h-px w-full bg-gray-light my-4" />
        </div>
      )}

      {/* DownloadColor */}
      {!!data?.room?.attachments?.length && (
        <div>
          <h3 className="text-sm text-gray-dark font-bold">الملفات</h3>

          {data?.room?.attachments?.map((attachment) => {
            return (
              <div
                key={attachment.name}
                className="flex gap-2 items-center mb-2 px-2 py-2 bg-white rounded-lg border border-gray-light shadow-sm mt-2.5 justify-between"
              >
                <div className="flex gap-2">
                  <img src="/assets/files-fill.svg" className="size-6" />
                  <h4 className="text-sm font-bold truncate  break-all">
                    {attachment.name}
                  </h4>
                </div>

                <LinkLocked
                  locked={locked}
                  className="flex items-center justify-center size-9 bg-primary-800 rounded-lg"
                >
                  <button
                    onClick={() => {
                      window.open(attachment.url, "_blank");
                    }}
                  >
                    <Download className="stroke-white size-5" />
                  </button>
                </LinkLocked>
              </div>
            );
          })}
        </div>
      )}

      {!!data?.assignments?.length && (
        <div>
          <h3 className="text-sm text-gray-dark font-bold">الواجبات</h3>

          {data?.assignments.map((ass) => {
            return (
              <div
                key={ass?.id}
                className="flex gap-2 items-center px-2 py-2 rounded-lg border border-gray-light shadow-sm bg-white mt-4 justify-between"
              >
                <div className="flex gap-2">
                  <img src="/assets/assignment-fill.svg" className="size-6" />
                  <h2 className="text-sm font-bold truncate break-all">
                    {ass?.title}
                  </h2>
                </div>

                <LinkLocked locked={locked}>
                  <Link
                    href={`/bundles/${SingleCourse}/${room}/assignment/${ass.id}`}
                    className="flex items-center justify-center size-9 bg-primary-800 rounded-lg"
                  >
                    <ChevronLeft className="stroke-white size-5" />
                  </Link>
                </LinkLocked>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default memo(RoomSideContent);
