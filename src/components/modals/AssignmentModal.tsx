import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import TaskModelScore from "@/modules/exam/components/TaskModelScore";
import { QuizStatus } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  showAnswers: () => void;
  start: QuizStatus;
  retake: () => void;
  taskId: string | number;
}

export default function AssignmentModal({
  open,
  showAnswers,
  start,
  retake,
  taskId,
}: Props) {
  const { SingleCourse, room } = useParams();

  return (
    <Dialog open={open}>
      <DialogContent
        key={start?.score_ratio || "no_result"}
        hideClose={true}
        className="p-8 max-w-xl bg-white rounded-lg shadow-lg"
      >
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="w-full">
          {start?.review_pending ? (
            <div className="flex items-center gap-2">
              {/* <img src="/assets/CorrectColor.svg" /> */}
              <p className="text-[#121212] inline-block text-lg font-bold">
                جارى تصحيح الواجب
              </p>
            </div>
          ) : (
            <>
              <Image
                src="/assets/confetti.gif"
                alt="confetti"
                width={56}
                height={56}
              />

              <div className="flex gap-3 mt-2 flex-wrap justify-between items-center ">
                <span className="inline-block text-base font-bold">
                  عمل رائع، حصلت على
                </span>
                <TaskModelScore score={start?.score} pass={start?.result} />
              </div>
            </>
          )}

          <div className="h-px my-[12px] bg-gray-light" />

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

          <div className=" flex justify-center items-center w-full mx-auto mt-8">
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
                    <Button
                      onClick={showAnswers}
                      className="h-11  w-full font-bold"
                    >
                      عرض الإجابات
                    </Button>
                  )}
                  {start?.retake && (
                    <Button
                      onClick={retake}
                      variant="secondary"
                      className="h-11  w-full font-bold"
                    >
                      إعادة الامتحان
                    </Button>
                  )}
                </>
              )}

              <Link
                href={`/bundles/${SingleCourse}/${room}`}
                className="inline-block w-full"
              >
                <Button variant="outline" className="h-11  w-full font-bold">
                  الرجوع للحصه
                </Button>
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
