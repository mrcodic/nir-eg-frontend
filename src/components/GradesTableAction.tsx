import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import { IActivity } from "@/types";
import Image from "next/image";
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
  const isExpired = row?.classroom_expired || row?.classroom === "--";

  return (
    <div className="flex h-14 w-full items-center justify-start gap-4 p-2">
      {isExpired && !haveAnswer ? (
        <p className="mx-auto text-center font-bold text-blue-600">
          انتهى الكورس بدون تصحيح
        </p>
      ) : (
        <div className="flex h-10 w-[136px] shrink-0 items-center gap-2 rounded-lg border border-gray-200 p-1 font-bold">
          {isExam && !row?.score_ratio ? null : (
            <Image
              src={
                row.passed ? "/assets/CorrectColor.svg" : "/assets/Close2.svg"
              }
              width={20}
              height={20}
              alt={row.passed ? "ناجح" : "راسب"}
            />
          )}

          {isExam ? (
            !!row?.score_ratio ? (
              <h3
                className={cn(
                  "flex items-center text-lg font-bold",
                  row.passed ? "text-[#1EAD7B]" : "text-[#B75050]",
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
            <span className="text-[16px] font-bold text-[#1EAD7B]">
              {rowValue}
            </span>
          )}
        </div>
      )}

      {isExpired ? (
        !haveAnswer ? null : (
          <ExamPDFGenerator
            taskId={row?.quiz_id}
            className="bg-secondary flex h-9 w-fit items-center justify-center rounded-[10px] p-1 px-2 text-sm font-bold text-white lg:h-10"
          />
        )
      ) : (
        <Link
          href={
            isExpired
              ? ""
              : row.type === "امتحان"
                ? `/bundles/${row.classroom_id}/general-exams/${row.quiz_id}`
                : `/bundles/${row.classroom_id}/${row.room_id}/${
                    row.type === "كويز" ? "exams" : "assignment"
                  }/${row.quiz_id}`
          }
          className={cn(
            "flex h-9 w-[120px] items-center justify-center rounded-[10px] bg-[#012D5A] p-1 text-sm font-bold text-white lg:h-10 lg:w-[155px]",
            {
              "pointer-events-none cursor-not-allowed bg-red-600": isExpired,
            },
          )}
        >
          {isExpired ? "تم انتهاء الكورس" : ` عرض ال${row?.type}`}
        </Link>
      )}
    </div>
  );
}

export default GradesTableAction;
