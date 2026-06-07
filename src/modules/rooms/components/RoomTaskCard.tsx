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
  subscribe: any;
  verify: any;
  locked: any;
  linkText: any;
  type: "exam" | "assignment";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background border-gray-light flex flex-wrap justify-between gap-2 rounded-md border p-2",
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

      <div className="ms-auto flex items-center gap-6 empty:hidden">
        {subscribe && verify && (
          <LinkLocked locked={locked}>
            <Link
              href={`/bundles/${classroomId}/${
                room?.id
              }/${type === "assignment" ? "assignment" : "exams"}/${task.id}`}
              className="w-full text-center"
            >
              {linkText}
            </Link>
          </LinkLocked>
        )}

        {task?.score !== null && (
          <StudentScoreResult
            score={Number(task?.score)}
            pass={!!task?.result}
            pending={task?.pending}
            type={type === "assignment" ? "واجب" : "كويز"}
            badgeClassName="border"
          />
        )}
      </div>
    </div>
  );
}

export default RoomTaskCard;
