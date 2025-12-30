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

export default function Passed({
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
        hideClose={true}
        className="max-w-xl rounded-lg bg-white p-8 shadow-lg"
      >
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="w-full">
          {!start?.review_pending && start?.result && (
            <div className="mb-6">
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
            </div>
          )}

          <div>
            {start?.review_pending ? (
              <div className="flex flex-col gap-3">
                <p className="inline-block text-lg font-bold text-[#121212]">
                  جارى تصحيح الامتحان
                </p>
                <p className="mt-6 text-[18px] font-medium">
                  - ستتمكن من عرض اجاباتك بعد تصحيح الامتحان
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <p className="inline-block">
                  - نجحت في الامتحان و جاوبت على{" "}
                  <span className="font-bold">{start?.score_ratio}</span> سؤال
                </p>

                {start?.retake && (
                  <p className="inline-block">
                    - إذا قمت بعرض الإجابات مرة أخرى لن تتمكن من إعادة الامتحان
                  </p>
                )}

                {start?.show_answer && !start?.review_pending && (
                  <p className="inline-block">
                    - يمكنك تنزيل نموذج الإجابة بالكامل
                  </p>
                )}
              </div>
            )}
          </div>

          <hr className="border-gray-light my-3 h-px" />

          <div
            className={cn("mt-6 grid w-full grid-cols-2 justify-center gap-6", {
              "grid-cols-1": start?.review_pending,
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
                    onClick={retake}
                    variant="outline"
                    className="h-11 w-full font-bold"
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
              <Button variant="outline" className="h-11 w-full font-bold">
                الرجوع للحصه
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
}
