import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

function GradesTableAction({ row, rowValue }: { row: any; rowValue: number }) {
  const isExam = row.type === "امتحان";

  return (
    <div className="flex items-center gap-4 w-full justify-start p-2">
      <div className="border flex shrink-0 items-center font-bold gap-2 p-1 rounded-lg w-[136px] border-[#121212]">
        {isExam && !row?.score_ratio ? null : (
          <Image
            src={row.passed ? "/assets/CorrectColor.svg" : "/assets/Close2.svg"}
            width={20}
            height={20}
            alt={row.passed ? "ناجح" : "راسب"}
          />
        )}

        {isExam ? (
          !!row?.score_ratio ? (
            <h3
              className={cn(
                "flex items-center font-bold text-lg",
                row.passed ? "text-[#1EAD7B]" : "text-[#B75050]"
              )}
            >
              {row.score_ratio ? (
                <span>{row.score_ratio}</span>
              ) : (
                <>
                  <span>%</span>
                  <span>{rowValue}</span>
                </>
              )}
            </h3>
          ) : (
            <span className={cn("text-[16px] font-bold text-yellow-800")}>
              جارى التصحيح
            </span>
          )
        ) : (
          <span className="text-[16px] text-[#1EAD7B] font-bold">
            {rowValue}
          </span>
        )}
      </div>

      <Link
        href={
          row?.classroom_expired
            ? ""
            : `/bundles/${row.classroom_id}/${row.room_id}/${
                row.type === "امتحان" ? "exams" : "assignment"
              }/${row.quiz_id}`
        }
        className={cn(
          "w-[120px] lg:w-[155px] h-9 lg:h-10 p-1 rounded-[10px] bg-[#012D5A] text-white text-sm lg:text-lg font-bold flex items-center justify-center",
          {
            "pointer-events-none cursor-not-allowed bg-red-600":
              row?.classroom_expired,
          }
        )}
      >
        {row?.classroom_expired
          ? "تم انتهاء الكورس"
          : ` عرض ${row.type === "امتحان" ? "الامتحان" : "الواجب"}`}
      </Link>
    </div>
  );
}

export default GradesTableAction;
