import LinkLocked from "@/layouts/LinkLocked";
import Link from "next/link";

const mapTypeToIcon = {
  exam: "/assets/exam-fill.svg",
  ass: "/assets/assignment-fill.svg",
  attach: "/assets/files-fill.svg",
};

function RoomDropDownItem({
  item,
  room,
  SingleCourse,
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
  SingleCourse: any;
  subscribe: any;
  verify: any;
  locked: any;
  linkText: any;
  type: "exam" | "ass" | "attach";
}) {
  return (
    <div className="p-2 border  justify-between rounded-md bg-background border-gray-light flex">
      <div className="font-bold flex gap-2 items-center">
        <img
          className="w-[28px] h-[28px] text-[#121212] bg-white "
          src={mapTypeToIcon[type]}
        />
        <span>{item?.title}</span>
      </div>

      {subscribe && verify && (
        <LinkLocked locked={locked}>
          <Link
            href={`/bundles/${SingleCourse || room?.id}/${
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

export default RoomDropDownItem;
