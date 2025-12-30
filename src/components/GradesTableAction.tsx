import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import Link from "next/link";
import ScoreBadge from "./ui/ScoreBadge";
import ScorePercent from "./ui/ScorePercent";

function GradesTableAction({ row, rowValue }: { row: any; rowValue: number }) {
  const type = row.type;
  const isExam = type === "امتحان";

  return (
    <div className="flex w-full items-center justify-start gap-4 p-2">
      <div className="flex w-[136px] shrink-0 items-center justify-center gap-2 rounded-lg p-1 font-bold">
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
              className="bg-yellow-50 text-yellow-500"
            />
          )
        ) : (
          <ScoreBadge passed={row.passed} type={row.type} />
        )}
      </div>

      {row?.classroom_expired || row?.classroom === "--" ? (
        <ExamPDFGenerator
          taskId={row?.quiz_id}
          className="bg-secondary mx-auto flex h-9 items-center justify-center rounded-[10px] p-1 text-sm font-bold text-white lg:h-10"
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
            "bg-primary mx-auto flex h-9 w-[120px] items-center justify-center rounded-[10px] p-1 text-sm font-bold text-white lg:h-10 lg:w-[155px]",
            {
              "pointer-events-none cursor-not-allowed bg-red-600":
                row?.classroom_expired,
            },
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
