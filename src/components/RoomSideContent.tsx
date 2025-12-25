"use client";

import { getCurrentTemplate } from "@/helpers/template.helpers";
import { useToast } from "@/hooks/use-toast";
import LinkLocked from "@/layouts/LinkLocked";
import { cn } from "@/lib/utils";
import { IRoomDetails } from "@/types";
import { convertMinutes } from "@/utils/clientFun";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { memo, useState } from "react";
import MarkVideoCompleted from "./MarkVideoCompleted";
import { Button } from "./ui/button";

type RoomSideContentProps = {
  data: IRoomDetails;
  onLessonClick?: (videoId?: string, lessonId?: string | number) => void;
  locked: boolean;
  videoId?: string;
  className?: string;
};

// ------- main component ----------

const RoomSideContent = ({
  data,
  onLessonClick,
  locked,
  videoId,
  className,
}: RoomSideContentProps) => {
  const { SingleCourse, room } = useParams();
  const template = getCurrentTemplate();
  const router = useRouter();

  return (
    <div
      className={cn(
        "overflow-y-auto max-h-[max(calc(100vh-88px),768px)] w-full border border-gray-light rounded-lg p-4 h-fit sticky top-22",
        { "top-29": template === 3 },
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Image
          src="/assets/grade-placeholder.png"
          className="size-16 rounded-lg"
          width={64}
          height={64}
          alt="grade placeholder"
        />

        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-[18px] font-bold line-clamp-1">
            {data.room.title}
          </h1>
          <hr className="h-px w-full border-gray-light" />
          <p className="text-xs text-gray-dark">{data.room.grade?.title}</p>
        </div>
      </div>

      {/* Back Button */}
      <Button
        onClick={() => router.push(`/bundles/${SingleCourse}`)}
        className="mt-6 w-full bg-white text-primary-800 border border-primary-800 py-2.5 h-11 hover:bg-primary-800 hover:text-white group"
      >
        <ChevronRight className="group-hover:stroke-white" />
        <span>العودة للكورس</span>
      </Button>

      {/* Lessons */}
      {data.lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          locked={locked}
          active={videoId === lesson.vedio_id}
          roomId={data.room.id}
          classroomId={SingleCourse as string}
          onClick={() => onLessonClick?.(lesson.vedio_id, lesson.id)}
        />
      ))}

      {/* Quizzes */}
      {!!data.quizzes?.length && (
        <>
          <div className="h-px w-full bg-gray-light my-4" />
          <h3 className="text-gray-dark text-sm font-bold">الامتحانات</h3>
          {data.quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} room={room as string} />
          ))}
        </>
      )}

      {/* Attachments */}
      {!!data.room.attachments?.length && (
        <>
          <div className="h-px w-full bg-gray-light my-4" />
          <h3 className="text-sm text-gray-dark font-bold">الملفات</h3>
          {data.room.attachments.map((attachment) => (
            <AttachmentCard
              key={attachment.name}
              attachment={attachment}
              locked={locked}
            />
          ))}
        </>
      )}

      {/* Assignments */}
      {!!data.assignments?.length && (
        <>
          <div className="h-px w-full bg-gray-light my-4" />
          <h3 className="text-sm text-gray-dark font-bold">الواجبات</h3>
          {data.assignments.map((ass) => (
            <AssignmentCard
              key={ass.id}
              assignment={ass}
              locked={locked}
              href={`/bundles/${SingleCourse}/${room}/assignment/${ass.id}`}
            />
          ))}
        </>
      )}
    </div>
  );
};

const LessonCard = memo(function LessonCard({
  lesson,
  active,
  locked,
  onClick,
  roomId,
  classroomId,
}: {
  lesson: any;
  active: boolean;
  locked: boolean;
  onClick?: () => void;
  roomId: string | number;
  classroomId: string;
}) {
  return (
    <div
      onClick={() => {
        if (locked) return;
        onClick?.();
      }}
      className={cn(
        "mt-4 border cursor-pointer rounded-lg mb-3 px-2 py-2",
        active
          ? "border-primary-800 bg-background"
          : "border-[#1EAD7B] bg-white"
      )}
    >
      <div className="flex text-sm items-center font-bold gap-4">
        <Image
          src="/assets/videos-fill.svg"
          className="size-6"
          width={24}
          height={24}
          alt="videos fill"
        />
        <h3 className="line-clamp-1">{lesson.title}</h3>
      </div>

      <div className="mr-10 flex justify-between mt-2">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/time.svg"
            className="size-5"
            width={20}
            height={20}
            alt="time"
          />
          <span className="text-xs font-medium">
            {isFinite(Number(lesson.duration))
              ? convertMinutes(Number(lesson.duration))
              : lesson.duration}
          </span>
        </div>

        <MarkVideoCompleted
          isCompleted={lesson.completed}
          roomId={roomId}
          classroomId={classroomId}
          lessonId={lesson.id}
        />
      </div>
    </div>
  );
});

const QuizCard = memo(function QuizCard({
  quiz,
  room,
}: {
  quiz: any;
  room: string;
}) {
  return (
    <div className="flex items-center px-2 py-2 rounded-lg border border-gray-light shadow-sm bg-white mt-4 justify-between">
      <Image
        src="/assets/exam-fill.svg"
        className="size-6"
        width={24}
        height={24}
        alt="exam fill"
      />
      <h3 className="text-sm grow font-bold truncate">{quiz.title}</h3>
      <Link
        href={`${room}/exams/${quiz.id}`}
        className="flex items-center justify-center size-9 bg-primary-800 rounded-lg"
      >
        <ChevronLeft className="stroke-white size-5" />
      </Link>
    </div>
  );
});

const isProd = process.env.NODE_ENV === "production";

const AttachmentCard = memo(function AttachmentCard({
  attachment,
  locked,
}: {
  attachment: { name: string; url: string };
  locked: boolean;
}) {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (downloading) return;

    try {
      setDownloading(true);

      const res = await fetch(
        isProd ? attachment.url : `/api/blob-proxy?url=${attachment.url}`
      );
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();

      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      toast({
        icon: "error",
        description: "حدث خطأ أثناء تحميل الملف",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center mb-2 px-2 py-2 bg-white rounded-lg border border-gray-light shadow-sm mt-2.5 justify-between">
      <Image
        src="/assets/files-fill.svg"
        className="size-6"
        width={24}
        height={24}
        alt="files fill"
      />

      <h4 className="text-sm grow font-bold truncate">{attachment.name}</h4>

      <LinkLocked
        locked={locked}
        className="flex items-center shrink-0 justify-center size-9 bg-primary-800 rounded-lg"
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="disabled:opacity-70"
        >
          {downloading ? (
            <Loader2 className="size-5 stroke-white animate-spin" />
          ) : (
            <Download className="stroke-white size-5" />
          )}
        </button>
      </LinkLocked>
    </div>
  );
});

const AssignmentCard = memo(function AssignmentCard({
  assignment,
  locked,
  href,
}: {
  assignment: any;
  locked: boolean;
  href: string;
}) {
  return (
    <div className="flex gap-2 items-center px-2 py-2 rounded-lg border border-gray-light shadow-sm bg-white mt-4 justify-between">
      <Image
        src="/assets/assignment-fill.svg"
        className="size-6"
        width={24}
        height={24}
        alt="assignment fill"
      />

      <h2 className="text-sm grow font-bold truncate">{assignment.title}</h2>

      <LinkLocked
        locked={locked}
        className="flex items-center shrink-0 justify-center size-9 bg-primary-800 rounded-lg"
      >
        <Link href={href}>
          <ChevronLeft className="stroke-white size-5" />
        </Link>
      </LinkLocked>
    </div>
  );
});

export default memo(RoomSideContent);
