import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import StudentScoreResult from "@/modules/exam/components/StudentScoreResult";
import { IActivity } from "@/types";
import Link from "next/link";

function GradesTableAction({
  row,
  rowValue,
}: {
  row: IActivity;
  rowValue: number;
}) {
  const isExam = row?.type !== "واجب";
  const haveAnswer = !!(row?.score_ratio || row?.score !== null);
  const isExpired = row?.classroom_expired;
  const isReviewPending = row?.review_pending;

  return (
    <div className="flex h-14 w-full items-center justify-start gap-4">
      {isExpired && !haveAnswer ? (
        <p className="mx-auto text-center font-bold text-blue-600">
          انتهى الكورس بدون تصحيح
        </p>
      ) : isReviewPending || haveAnswer ? (
        <StudentScoreResult
          score={rowValue}
          pass={!isExam || row?.passed}
          pending={isReviewPending}
          type={row.type}
        />
      ) : (
        !isReviewPending &&
        !haveAnswer && (
          <p className="text-secondary bg-secondary-50 w-[116px] rounded-xl py-1 text-center font-bold">
            لم يتم الحل بعد
          </p>
        )
      )}

      {isExpired
        ? haveAnswer && (
            <ExamPDFGenerator
              taskId={row?.quiz_id}
              className="bg-secondary flex h-9 w-fit items-center justify-center rounded-[10px] p-1 px-2 text-sm font-bold text-white lg:h-10"
            />
          )
        : !isReviewPending && (
            <Link
              href={
                row.type === "امتحان"
                  ? `/bundles/${row?.classroom_id}/general-exams/${row.quiz_id}`
                  : `/bundles/${row?.classroom_id}/${row.room_id}/${
                      row.type === "كويز" ? "exams" : "assignment"
                    }/${row.quiz_id}`
              }
              className={cn(
                "bg-primary-800 hover:bg-primary/80 flex h-9 w-[120px] items-center justify-center rounded-[10px] p-1 text-sm font-bold text-white transition-all lg:h-10 lg:w-[155px]",
              )}
            >
              {` عرض ال${row?.type}`}
            </Link>
          )}
    </div>
  );
}

export default GradesTableAction;
