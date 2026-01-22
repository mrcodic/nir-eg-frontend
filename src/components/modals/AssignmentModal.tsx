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
import { memo } from "react";
import SmallSpinner from "../custom/SmallSpinner";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  showAnswers: () => void;
  start: QuizStatus;
  retake: () => Promise<void>;
  taskId: string | number;
  isLoadingRetake: boolean;
}

const AssignmentModal = ({
  open,
  showAnswers,
  start,
  retake,
  taskId,
  isLoadingRetake,
}: Props) => {
  const { SingleCourse, room } = useParams();

  return (
    <Dialog open={open}>
      <DialogContent
        key={start?.score_ratio || "no_result"}
        hideClose={true}
        className="max-w-xl rounded-lg bg-white p-8 shadow-lg"
      >
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="w-full">
          {start?.review_pending ? (
            <div className="flex items-center gap-2">
              {/* <img src="/assets/CorrectColor.svg" /> */}
              <p className="inline-block text-lg font-bold text-[#121212]">
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

              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-block text-base font-bold">
                  عمل رائع، حصلت على
                </span>
                <TaskModelScore score={start?.score} pass={start?.result} />
              </div>
            </>
          )}

          <div className="bg-gray-light my-3 h-px" />

          {start?.review_pending ? (
            <span className="inline-block font-medium text-[#121212]">
              جارى تصحيح الواجب الخاص بك
            </span>
          ) : (
            <span className="inline-block font-medium text-[#121212]">
              {start?.show_answer && start?.retake
                ? "يمكنك عرض اجاباتاك او محاولة حل الواجب مرة اخرى"
                : start?.show_answer
                  ? "يمكنك عرض اجاباتاك"
                  : start?.retake
                    ? "يمكنك محاولة حل الواجب مرة اخرى"
                    : start?.score_ratio && "تم حل الواجب بنجاح"}
            </span>
          )}

          <div className="mx-auto mt-8 flex w-full items-center justify-center">
            <div
              className={cn("grid justify-center gap-6 md:grid-cols-2", {
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
                      className="h-11 w-full font-bold"
                    >
                      عرض الإجابات
                    </Button>
                  )}
                  {start?.retake && (
                    <Button
                      onClick={async () => await retake()}
                      variant="secondary"
                      className="h-11 w-full font-bold"
                      disabled={isLoadingRetake}
                    >
                      {isLoadingRetake ? (
                        <SmallSpinner className="text-white" />
                      ) : (
                        "إعادة الامتحان"
                      )}
                    </Button>
                  )}
                </>
              )}

              <Link
                href={`/bundles/${SingleCourse}/${room}`}
                className="inline-block w-full"
              >
                <Button variant="outline" className="h-11 w-full font-bold">
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
};

export default memo(AssignmentModal);
