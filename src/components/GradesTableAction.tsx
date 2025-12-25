import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import Link from "next/link";
import ScoreBadge from "./ui/ScoreBadge";
import ScorePercent from "./ui/ScorePercent";

function GradesTableAction({ row, rowValue }: { row: any; rowValue: number }) {
  const type = row.type;
  const isExam = type === "امتحان";

  return (
    <div className="flex items-center gap-4 w-full justify-start p-2">
      <div className=" flex shrink-0 items-center justify-center font-bold gap-2 p-1 rounded-lg w-[136px] ">
        {isExam ? (
          !!row?.score_ratio ? (
            <>
              <ScorePercent
                score={rowValue}
                passed={row.passed}
                type={row.type}
              />
              <ScoreBadge passed={row.passed} type={row.type} />
            </>
          ) : (
            <ScoreBadge
              passed={row.passed}
              type={row.type}
              text="جارى التصحيح"
              className="text-yellow-500 bg-yellow-50"
            />
          )
        ) : (
          <ScoreBadge passed={row.passed} type={row.type} />
        )}
      </div>

      {row?.classroom_expired || row?.classroom === "--" ? (
        <ExamPDFGenerator
          taskId={row?.quiz_id}
          className=" h-9 lg:h-10 p-1 rounded-[10px] bg-primary text-white text-sm  font-bold flex items-center justify-center"
        />
      ) : (
        <Link
          href={
            row?.classroom_expired
              ? ""
              : `/bundles/${row.classroom_id}/${row.room_id}/${
                  row.type === "امتحان" ? "exams" : "assignment"
                }/${row.quiz_id}`
          }
          className={cn(
            "w-[120px] lg:w-[155px] h-9 lg:h-10 p-1 rounded-[10px] bg-primary text-white text-sm lg:text-lg font-bold flex items-center justify-center",
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
      )}
    </div>
  );
}

export default GradesTableAction;
