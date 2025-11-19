import LinkLocked from "@/layouts/LinkLocked";
import Link from "next/link";

const mapTypeToIcon = {
  exam: "/assets/FillExams.svg",
  ass: "/assets/FillAssignments.svg",
  attach: "/assets/FillAttach.svg",
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
    title: string;
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
    <div className="p-2 border my-4  justify-between rounded-md bg-white border-primary-700 flex">
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
            className="w-[155px] flex justify-center items-center bg-color-primary border border-primary-700 rounded-md   text-white h-[28px]"
          >
            {linkText}
          </Link>
        </LinkLocked>
      )}
    </div>
  );
}

// {(room?.is_subscriped || subscribe) &&
//                           (room?.parent_phone_verification || verify) && (
//                             <LinkLocked locked={lock_after == 0}>
//                               <Link
//                                 href={`/bundles/${SingleCourse || room?.id}/${
//                                   room?.latest_room?.id || room?.id
//                                 }/exams/${quiz.id}`}
//                                 className="w-[155px] flex justify-center items-center bg-color-primary border border-primary-700 rounded-md   text-white h-[28px]"
//                               >
//                                 فتح الامتحان
//                               </Link>
//                             </LinkLocked>
//                           )}

export default RoomDropDownItem;
