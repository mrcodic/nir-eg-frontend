import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import TaskModelScore from "@/modules/exam/components/TaskModelScore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
    <>
      <Dialog open={open}>
        <DialogContent className="p-8 flex justify-center items-center  bg-white rounded-lg shadow-lg">
          <div className=" ">
            <div className="">
              <DotLottieReact
                className="w-[112px] h-[112px] mx-auto"
                src="/Animations/Fail.json"
                autoplay
                loop
              />
              {/* <DotLottieReact
                  className="w-[112px] h-[112px] mx-auto"
                  src="/Animations/fail.json"
                  autoplay
                  loop
                /> */}

              <div className="flex gap-3 mt-[32px] flex-wrap ">
                <div className="flex items-center gap-2">
                  <img src="/assets/Close2.svg" />
                  <span className="text-[#121212] inline-block text-lg font-bold">
                    لا بأس، جاوبت على
                  </span>
                </div>
                <TaskModelScore score={score} pass={false} />
              </div>

              <div className="h-px my-[12px] bg-primary-700" />
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
                    "md:grid-cols-1": !start?.retake,
                  })}
                >
                  {/* {start?.show_answer && (
                    <button
                      onClick={() => showAnswers()}
                      className=" w-full md:w-[172px] bg-color-primary h-[32px] text-[14px] font-bold text-white rounded-md border border-primary-700"
                    >
                      عرض الإجابات
                    </button>
                  )} */}
                  {start?.retake && (
                    <button
                      onClick={() => retake()}
                      className=" w-[172px] border border-color-primary px-[12px] font-bold text-[#121212] text-[14px] rounded-[8px]"
                    >
                      إعادة الامتحان
                    </button>
                  )}

                  <Link href={`/bundles/${SingleCourse}/${room}`}>
                    <button className="w-[172px] border border-color-primary h-[32px] text-[14px] font-bold text-[#121212] rounded-md">
                      الرجوع للحصة{" "}
                    </button>
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
    </>
  );
}

// <DialogFooter className="flex justify-center items-center  w-full mt-5">
// <DialogClose
//   asChild
//   className="flex items-center justify-center! w-full"
// >
//   <Button
//     type="button"
//     className="text-gray-25 border-2 bg-white hover:bg-gray-100 w-[200px] mx-auto text-black"
//   >
//     تأكيد
//   </Button>
// </DialogClose>
// </DialogFooter>
