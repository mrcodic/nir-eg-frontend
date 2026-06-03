import LinkLocked from "@/layouts/LinkLocked";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const mapTypeToIcon = {
  exam: "/assets/icons/exam-fill.svg",
  ass: "/assets/assignment-fill.svg",
  attach: "/assets/files-fill.svg",
};

function RoomDropDownQuiz({
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
  task: {
    id: number;
    title?: string | null;
  };
  room: any;
  classroomId: any;
  subscribe: any;
  verify: any;
  locked: any;
  linkText: any;
  type: "exam" | "ass" | "attach";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background border-gray-light flex justify-between rounded-md border p-2",
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

      {subscribe && verify && (
        <LinkLocked locked={locked}>
          <Link
            href={`/bundles/${classroomId}/${
              room?.latest_room?.id || room?.id
            }/${type === "ass" ? "assignment" : "exams"}/${task.id}`}
            className="w-full text-center"
          >
            {linkText}
          </Link>
        </LinkLocked>
      )}
    </div>
  );
}

export default RoomDropDownQuiz;
