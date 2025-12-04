import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import TaskModelScore from "@/modules/exam/components/TaskModelScore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";

export default function Fail({
  open,
  score,
  showAnswers,
  start,
  retake,
  taskId,
}) {
  const { SingleCourse, room } = useParams();

  return (
    <Dialog open={open}>
      <DialogContent className="p-8 flex justify-center items-center  bg-white rounded-lg shadow-lg">
        <DialogTitle />
        <DialogDescription />
        <div className=" ">
          <div className="">
            <DotLottieReact
              className="w-[112px] h-[112px] mx-auto"
              src="/Animations/Fail.json"
              autoplay
              loop
            />

            <div className="flex gap-3 mt-[32px] flex-wrap ">
              <div className="flex items-center gap-2">
                <img src="/assets/Close2.svg" />
                <span className="text-[#121212] inline-block text-lg font-bold">
                  لا بأس، حصلت على
                </span>
              </div>
              <TaskModelScore score={score} pass={false} />
            </div>

            <div className="h-[1px] my-[12px] bg-[#D9B45C]" />
            <span className="text-[#121212] inline-block font-medium">
              إذا قمت بعرض الإجابات مرة أخرى لن تتمكن من إعادة الامتحان
            </span>

            {/* <p className="text-[18px] text-[#121212] font-medium mt-[24px]">
                يمكنك تنزيل نموذج الإجابة بالكامل أو يمكنك تنزيل إجابات الأسئلة
                التي قمت بالإخطاء في الإجابة عنها
              </p> */}
            <div className="mb-[32px] flex justify-center items-center w-full mx-auto mt-[32px]">
              <div
                className={cn("grid md:grid-cols-2 justify-center gap-6", {
                  "md:grid-cols-1": !start?.retake && !start?.show_answer,
                })}
              >
                {start?.show_answer && (
                  <Button
                    onClick={() => showAnswers()}
                    className="h-11 max-w-[184px] w-full font-bold"
                  >
                    عرض الإجابات
                  </Button>
                )}
                {start?.retake && (
                  <Button
                    onClick={() => retake()}
                    variant="secondary"
                    className="h-11 max-w-[184px] w-full font-bold"
                  >
                    إعادة الامتحان
                  </Button>
                )}

                <Link href={`/bundles/${SingleCourse}/${room}`}>
                  <Button
                    variant="outline"
                    className="h-11 max-w-[184px] w-full font-bold"
                  >
                    الرجوع للحصه
                  </Button>
                </Link>

                {/* {start?.show_answer && !start?.review_pending && (
                    <ExamPDFGenerator taskId={taskId} />
                  )} */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
