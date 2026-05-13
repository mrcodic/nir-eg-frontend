import LinkLocked from "@/layouts/LinkLocked";
import Link from "next/link";

const mapTypeToIcon = {
  exam: "/assets/exam-fill.svg",
  ass: "/assets/assignment-fill.svg",
  attach: "/assets/files-fill.svg",
};

function RoomDropDownQuiz({
  item,
  room,
  classroomId,
  subscribe,
  verify,
  locked,
  linkText,
  type,
}: {
  item: {
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
}) {
  return (
    <div className="bg-background border-gray-light flex justify-between rounded-md border p-2">
      <div className="flex items-center gap-2 font-bold">
        <img
          className="h-[28px] w-[28px] bg-white text-black"
          src={mapTypeToIcon[type]}
        />
        <span>{item?.title}</span>
      </div>

      {subscribe && verify && (
        <LinkLocked locked={locked}>
          <Link
            href={`/bundles/${classroomId}/${
              room?.latest_room?.id || room?.id
            }/${type === "ass" ? "assignment" : "exams"}/${item.id}`}
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
