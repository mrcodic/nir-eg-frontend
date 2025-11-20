import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import TaskModelScore from "@/modules/exam/components/TaskModelScore";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AssignmentModal({
  open,
  score,
  showAnswers,
  start,
  retake,
  taskId,
}) {
  const { SingleCourse, room } = useParams();

  console.log(start?.review_pending && !start?.show_answer && !start?.retake);

  return (
    <Dialog open={open}>
      <DialogContent
        key={start?.score_ratio || "no_result"}
        className="p-8 max-w-xl bg-white rounded-lg shadow-lg"
      >
        <div>
          <div className="mb-[12px]">
            <div className="flex gap-3 mt-[32px] flex-wrap">
              {start?.review_pending ? (
                <div className="flex items-center gap-2">
                  <img src="/assets/CorrectColor.svg" />
                  <p className="text-[#121212] inline-block text-lg font-bold">
                    جارى تصحيح الواجب
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <img src="/assets/CorrectColor.svg" />
                    <span className="text-[#121212] inline-block text-lg font-bold">
                      جاوبت على
                    </span>
                  </div>
                  <TaskModelScore score={score} />
                </>
              )}
            </div>
          </div>

          <div className="h-px my-[12px] bg-primary-700" />

          {start?.review_pending ? (
            <span className="text-[#121212] inline-block font-medium">
              ستتمكن من عرض اجاباتك بعد تصحيح الواجب
            </span>
          ) : (
            <span className="text-[#121212] inline-block font-medium">
              {start?.show_answer && start?.retake
                ? "يمكنك عرض اجاباتاك او محاولة حل الواجب مرة اخرى"
                : start?.show_answer
                ? "يمكنك عرض اجاباتاك"
                : start?.retake
                ? "يمكنك محاولة حل الواجب مرة اخرى"
                : start?.score_ratio && "تم حل الواجب بنجاح"}
            </span>
          )}

          <div className="mb-[32px] flex justify-center items-center w-full mx-auto mt-[32px]">
            <div
              className={cn("grid md:grid-cols-2 justify-center gap-6", {
                "md:grid-cols-1":
                  start?.review_pending ||
                  (!start?.show_answer && !start?.retake),
              })}
            >
              {!start?.review_pending && (
                <>
                  {start?.show_answer && (
                    <button
                      onClick={showAnswers}
                      className=" w-full md:w-[172px] bg-primary h-[32px] text-sm font-bold text-white rounded-md border border-primary-700"
                    >
                      عرض الإجابات
                    </button>
                  )}
                  {start?.retake && (
                    <button
                      className="bg-primary-700 py-1 w-full md:w-[172px] borer border-primary px-[12px] font-bold text-white text-sm rounded-lg"
                      onClick={() => retake()}
                    >
                      إعادة الواجب
                    </button>
                  )}
                </>
              )}

              <Link href={`/bundles/${SingleCourse}/${room}`}>
                <button className="w-[172px] border border-primary h-[32px] text-sm font-bold text-[#121212] rounded-md">
                  الرجوع للحصه
                </button>
              </Link>

              {start?.show_answer && !start?.review_pending && (
                <ExamPDFGenerator taskId={taskId} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
