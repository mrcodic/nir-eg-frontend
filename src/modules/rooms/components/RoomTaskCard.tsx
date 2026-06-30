import ScoreBadge from "@/components/ui/ScoreBadge";
import LinkLocked from "@/layouts/LinkLocked";
import { cn } from "@/lib/utils";
import StudentScoreResult from "@/modules/exam/components/StudentScoreResult";
import { IAssignment, IRoomData, QuizItem } from "@/types";
import Image from "next/image";
import Link from "next/link";

const mapTypeToIcon = {
  exam: "/assets/icons/exam-fill.svg",
  assignment: "/assets/icons/assignment-fill.svg",
  attach: "/assets/files-fill.svg",
};

const isPastDue = (date: string, timeInMinutes: number) => {
  if (!date || !timeInMinutes) return false;
  // add exam timer to the date
  const timeToAdd = timeInMinutes * 60 * 1000;
  const finalDate = new Date(date).getTime() + timeToAdd;
  return new Date(finalDate) < new Date();
};

function RoomTaskCard({
  task,
  room,
  classroomId,
  subscribe,
  verify,
  locked,
  linkText,
  type,
  className,
}: {
  task: QuizItem | IAssignment;
  room: IRoomData;
  classroomId: any;
  subscribe: boolean;
  verify?: boolean;
  locked?: boolean;
  linkText: string;
  type: "exam" | "assignment";
  className?: string;
}) {
  const quizTimerExpired =
    task?.start_timer && isPastDue(task?.start_timer, task?.timer);

  return (
    <div
      className={cn(
        "bg-background border-gray-light flex w-full flex-wrap justify-between gap-2 rounded-md border p-2",
        className,
      )}
    >
      <div className="flex items-center gap-2 font-bold">
        <Image
          className="h-7 w-7"
          src={mapTypeToIcon[type]}
          width={28}
          height={28}
          alt={type}
        />
        <span className="line-clamp-1">{task?.title}</span>
      </div>

      <div className="ms-auto flex shrink-0 grow flex-wrap items-center justify-end gap-4 empty:hidden max-[340px]:flex-col max-[340px]:items-end">
        {subscribe && verify && (
          <LinkLocked locked={locked} className="w-fit py-1">
            <Link
              href={`/bundles/${classroomId}/${
                room?.id
              }/${type === "assignment" ? "assignment" : "exams"}/${task.id}`}
              className="block w-full"
            >
              {linkText}
            </Link>
          </LinkLocked>
        )}

        {(typeof task?.score === "number" && task?.score !== null) ||
        task?.review_pending ? (
          <StudentScoreResult
            score={Number(task?.score)}
            pass={!!task?.result}
            pending={task?.review_pending || task?.pending}
            type={type === "assignment" ? "واجب" : "كويز"}
            badgeClassName="border"
            className="min-w-0"
          />
        ) : !!task?.start_timer ? (
          <div className="flex items-center gap-2">
            <ScoreBadge
              text={
                quizTimerExpired
                  ? "انتهى وقت الكويز"
                  : `موعد التسليم  ${
                      new Date(
                        new Date(task?.start_timer).getTime() +
                          task?.timer * 60 * 1000,
                      )
                        .toLocaleString("en-GB")
                        .split(" ")[1]
                    }`
              }
              type="exam"
              passed={false}
              pending={true}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default RoomTaskCard;
