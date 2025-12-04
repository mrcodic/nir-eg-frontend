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

export default function Fail({
  open,
  showAnswers,
  start,
  retake,
  taskId,
}: Props) {
  const { SingleCourse, room } = useParams();

  console.log(start);

  return (
    <Dialog open={open}>
      <DialogContent className="p-8 flex justify-center items-center  bg-white rounded-lg shadow-lg">
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <div className="w-full">
          <Image src="/assets/fail.gif" alt="Fail" width={56} height={56} />

          <div className="flex gap-3 mt-2 flex-wrap justify-between items-center ">
            <span className="inline-block text-base font-bold">
              لا بأس، حصلت على
            </span>
            <TaskModelScore score={start?.score} pass={start?.result} />
          </div>

          <div className="mt-6 space-y-2 border-b border-gray-light pb-2">
            <p className=" inline-block font-bold">
              - رسبت في الامتحان و حصلت على {start?.score_ratio}
            </p>

            {start?.retake && (
              <p className=" inline-block font-bold">
                - إذا قمت بعرض الإجابات مرة أخرى لن تتمكن من إعادة الامتحان
              </p>
            )}
            {start?.show_answer && !start?.review_pending && (
              <p className=" inline-block font-bold">
                - يمكنك تنزيل نموذج الإجابة بالكامل
              </p>
            )}
          </div>

          <div
            className={cn(
              "grid grid-cols-2 justify-center gap-6  mt-6 w-full",
              {
                "grid-cols-1": !start?.retake && !start?.show_answer,
              }
            )}
          >
            {start?.show_answer && (
              <Button
                onClick={() => showAnswers()}
                className="h-11  w-full font-bold"
              >
                عرض الإجابات
              </Button>
            )}
            {start?.retake && (
              <Button
                onClick={() => retake()}
                variant="secondary"
                className="h-11  w-full font-bold"
              >
                إعادة الامتحان
              </Button>
            )}

            <Link
              href={`/bundles/${SingleCourse}/${room}`}
              className="inline-block"
            >
              <Button variant="outline" className="h-11  w-full font-bold">
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
