import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import StudentScoreResult from "@/modules/exam/components/StudentScoreResult";
import { QuizStatus, TaskType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { memo } from "react";
import SmallSpinner from "../custom/SmallSpinner";
import { ExamType } from "../forms/ExamForm";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  showAnswers: () => void;
  start: QuizStatus;
  retake: () => void;
  taskId: string | number;
  isLoadingRetake: boolean;
  examType?: ExamType;
  type?: TaskType;
}

const FailModal = ({
  open,
  showAnswers,
  start,
  retake,
  taskId,
  isLoadingRetake,
  examType,
  type = "امتحان",
}: Props) => {
  const { classroomId, room } = useParams();

  return (
    <Dialog open={open}>
      <DialogContent
        hideClose={true}
        className="flex items-center justify-center rounded-lg bg-white p-8 shadow-lg"
      >
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />

        <div className="w-full">
          <Image
            src="/assets/gifs/fail.gif"
            alt="Fail"
            width={56}
            height={56}
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="inline-block text-base font-bold">
              لا بأس، حصلت على
            </span>
            <StudentScoreResult
              score={start?.score}
              pass={start?.result}
              pending={start?.review_pending}
              type={type}
            />
          </div>

          <div className="border-gray-light mt-6 space-y-2 border-b pb-2">
            <p className="inline-block">
              - رسبت في {type} و حصلت على{" "}
              <span className="font-bold">{start?.score_ratio}</span> درجة
            </p>

            {start?.show_answer && start?.retake && (
              <p className="inline-block">
                - إذا قمت بعرض الإجابات مرة أخرى لن تتمكن من إعادة {type}
              </p>
            )}

            {start?.show_answer && !start?.review_pending && (
              <p className="inline-block">
                - يمكنك تنزيل نموذج الإجابة بالكامل
                {start?.retake && ` , اذا قمت بذلك لن تتمكن من اعاده ${type}`}
              </p>
            )}

            {!start?.result && (
              <p className="inline-block">
                {examType === "general"
                  ? "- اجاباتك ستكون متاحه بعد انتهاء الوقت المحدد للامتحان"
                  : "- لن تتمكن من عرض الاجابات حتى تنجح"}
              </p>
            )}
          </div>

          <div
            className={cn("mt-6 grid w-full grid-cols-2 justify-center gap-6", {
              "grid-cols-1": !start?.retake && !start?.show_answer,
            })}
          >
            {start?.show_answer && (
              <Button
                onClick={() => showAnswers()}
                className="h-11 w-full font-bold"
              >
                عرض الإجابات
              </Button>
            )}
            {start?.retake && (
              <Button
                onClick={async () => await retake()}
                variant="outline"
                className="h-11 w-full font-bold"
                disabled={isLoadingRetake}
              >
                {isLoadingRetake ? <SmallSpinner /> : `إعادة ال${type}`}
              </Button>
            )}

            <Link
              href={
                examType === "general"
                  ? `/bundles/${classroomId}`
                  : `/bundles/${classroomId}/${room}`
              }
              className="inline-block"
            >
              <Button variant="outline" className="h-11 w-full font-bold">
                الرجوع {examType === "general" ? "للكورس" : "للحصة"}{" "}
              </Button>
            </Link>

            {start?.show_answer && !start?.review_pending && (
              <ExamPDFGenerator taskId={Number(taskId)} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(FailModal);
