"use client";

import useFileDownload from "@/hooks/useFileDownload";
import LinkLocked from "@/layouts/LinkLocked";
import { cn } from "@/lib/utils";
import MarkVideoCompleted from "@/modules/video/components/MarkVideoCompleted";
import { IRoomDetails } from "@/types";
import { convertMinutes } from "@/utils/clientFun";
import { ChevronLeft, Download, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

type Lesson = IRoomDetails["lessons"][number];
type Quiz = IRoomDetails["quizzes"][number];
type Assignment = IRoomDetails["assignments"][number];
type Attachment = IRoomDetails["room"]["attachments"][number];

const LessonCard = memo(function LessonCard({
  lesson,
  active,
  locked,
  onClick,
  roomId,
  classroomId,
}: {
  lesson: Lesson;
  active: boolean;
  locked: boolean;
  onClick?: () => void;
  roomId: number;
  classroomId: string;
}) {
  return (
    <div
      aria-disabled={locked || active}
      role="button"
      onClick={() => {
        if (locked || active) return;
        onClick?.();
      }}
      className={cn(
        "relative mt-4 cursor-pointer rounded-lg border px-2 py-2 aria-disabled:cursor-default",
        active
          ? "border-primary-800 bg-background"
          : "border-semantics-green bg-white",
        locked && "border-gray-light cursor-not-allowed",
      )}
    >
      <div className="flex items-center gap-4 text-sm font-bold">
        <Image
          src="/assets/videos-fill.svg"
          className="size-6"
          width={24}
          height={24}
          alt="videos fill"
        />
        <h3 className="line-clamp-1">{lesson.title}</h3>
      </div>

      <div className="mt-2 mr-10 flex flex-wrap justify-between gap-y-1">
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
              : lesson.duration || "--"}
          </span>
        </div>

        {!locked && (
          <MarkVideoCompleted
            isCompleted={lesson.completed}
            roomId={roomId}
            classroomId={classroomId}
            lessonId={lesson.id}
          />
        )}

        {locked && (
          <Image
            src="/assets/Locked.png"
            width={48}
            height={48}
            className="absolute bottom-1 left-1 size-12 bg-white/50 object-contain"
            alt="lock image"
          />
        )}
      </div>
    </div>
  );
});

const QuizCard = memo(function QuizCard({
  quiz,
  href,
  locked,
}: {
  quiz: Quiz; // ✅ FIX #11
  href: string;
  locked: boolean;
}) {
  return (
    <div className="border-gray-light mt-4 flex items-center justify-between rounded-lg border bg-white px-2 py-2 shadow-sm">
      <Image
        src="/assets/exam-fill.svg"
        className="size-6"
        width={24}
        height={24}
        alt="exam fill"
      />
      <h3 className="grow truncate text-sm font-bold">{quiz.title}</h3>

      <LinkLocked
        locked={locked} // ✅ FIX #9 — prop is now correctly forwarded (was hardcoded false in parent)
        className="bg-primary-800 flex size-9 shrink-0 items-center justify-center rounded-lg"
      >
        <Link href={href}>
          <ChevronLeft className="size-5 stroke-white" />
        </Link>
      </LinkLocked>
    </div>
  );
});

const AttachmentCard = memo(function AttachmentCard({
  attachment,
  locked,
}: {
  attachment: Attachment; // ✅ FIX #11
  locked: boolean;
}) {
  const { handleDownload, isDownloading } = useFileDownload({ attachment });

  return (
    <div className="border-gray-light mt-2.5 mb-2 flex items-center justify-between gap-2 rounded-lg border bg-white px-2 py-2 shadow-sm">
      <Image
        src="/assets/files-fill.svg"
        className="size-6"
        width={24}
        height={24}
        alt="files fill"
      />

      <h4 className="line-clamp-1 w-full grow text-sm font-bold break-all">
        {attachment.name}
      </h4>

      <LinkLocked
        locked={locked}
        className="bg-primary-800 flex size-9 shrink-0 items-center justify-center rounded-lg"
      >
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="disabled:opacity-70"
        >
          {isDownloading ? (
            <Loader2 className="size-5 animate-spin stroke-white" />
          ) : (
            <Download className="size-5 stroke-white" />
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
  assignment: Assignment; // ✅ FIX #11
  locked: boolean;
  href: string;
}) {
  return (
    <div className="border-gray-light mt-4 flex items-center justify-between gap-2 rounded-lg border bg-white px-2 py-2 shadow-sm">
      <Image
        src="/assets/assignment-fill.svg"
        className="size-6"
        width={24}
        height={24}
        alt="assignment fill"
      />

      <h2 className="grow truncate text-sm font-bold">{assignment.title}</h2>

      <LinkLocked
        locked={locked}
        className="bg-primary-800 flex size-9 shrink-0 items-center justify-center rounded-lg"
      >
        <Link href={href}>
          <ChevronLeft className="size-5 stroke-white" />
        </Link>
      </LinkLocked>
    </div>
  );
});

export { AssignmentCard, AttachmentCard, LessonCard, QuizCard };
