import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import TaskModelScore from "@/modules/exam/components/TaskModelScore";
import { QuizStatus } from "@/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { memo, Suspense } from "react";
import SmallSpinner from "../custom/SmallSpinner";
import { ExamType } from "../forms/ExamForm";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const ExamPDFGenerator = dynamic(
  () => import("@/modules/exam/components/ExamPDFGenerator"),
  {
    ssr: false,
  },
);

interface Props {
  open: boolean;
  showAnswers: () => void;
  start: QuizStatus;
  retake: () => Promise<void>;
  taskId: string | number;
  isLoadingRetake: boolean;
  examType?: ExamType;
}

const PassedModal = ({
  open,
  showAnswers,
  start,
  retake,
  taskId,
  isLoadingRetake,
  examType,
}: Props) => {
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
                src="/assets/gifs/confetti.gif"
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
                  - ستتمكن من رؤية درجتك بعد الانتهاء من تصحيح الامتحان
                </p>
                {start?.show_answer && (
                  <p className="mt-6 text-[18px] font-medium">
                    - ستتمكن من عرض اجاباتك بعد تصحيح الامتحان
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <p className="inline-block">
                  - نجحت في الامتحان و حصلت على{" "}
                  <span className="font-bold">{start?.score_ratio}</span> درجة
                </p>

                {start?.retake && start?.show_answer && (
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
            className={cn(
              "mt-6 grid w-full justify-center gap-6 md:grid-cols-2",
              {
                "md:grid-cols-1":
                  start?.review_pending ||
                  (!start?.show_answer && !start?.retake),
              },
            )}
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
                    variant="outline"
                    className="h-11 w-full font-bold"
                    disabled={isLoadingRetake}
                  >
                    {isLoadingRetake ? <SmallSpinner /> : "إعادة الامتحان"}
                  </Button>
                )}
              </>
            )}

            <Link
              href={
                examType === "general"
                  ? `/bundles/${SingleCourse}`
                  : `/bundles/${SingleCourse}/${room}`
              }
              className="inline-block w-full"
            >
              <Button variant="outline" className="h-11 w-full font-bold">
                الرجوع {examType === "general" ? "للكورس" : "للحصة"}
              </Button>
            </Link>

            {start?.show_answer && !start?.review_pending && (
              <Suspense fallback={<Skeleton className="h-11 w-full" />}>
                <ExamPDFGenerator taskId={Number(taskId)} />
              </Suspense>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(PassedModal);
