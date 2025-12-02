import { cn } from "@/lib/utils";
import Link from "next/link";

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

      <Link
        href={
          row?.classroom_expired
            ? ""
            : `/bundles/${row.classroom_id}/${row.room_id}/${
                row.type === "امتحان" ? "exams" : "assignment"
              }/${row.quiz_id}`
        }
        className={cn(
          "w-[120px]  h-9 p-1 rounded-lg bg-primary-800 text-white text-sm  font-bold flex items-center justify-center",
          {
            "pointer-events-none cursor-not-allowed text-red-600 bg-red-50":
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

const ScorePercent = ({
  score,
  passed,
  type,
}: {
  score: number;
  passed: boolean;
  type: string;
}) => {
  return (
    <h3
      className={cn(
        "flex items-center font-bold text-xl",
        passed ? "text-semantics-green" : "text-semantics-red"
      )}
    >
      {score}%
    </h3>
  );
};

const ScoreBadge = ({
  passed,
  type,
  className,
  text,
}: {
  passed: boolean;
  type: string;
  className?: string;
  text?: string;
}) => {
  return (
    <h3
      className={cn(
        "flex items-center font-bold text-sm min-w-20 py-1 px-2 rounded-lg justify-center",
        passed || type === "واجب"
          ? "text-semantics-green bg-semantics-green-light"
          : "text-semantics-red bg-semantics-red-light",
        className
      )}
    >
      {text || (type === "واجب" ? "تم الحل" : passed ? "ناجح" : "راسب")}
    </h3>
  );
};
