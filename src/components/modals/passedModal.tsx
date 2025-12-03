import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import TaskModelScore from "@/modules/exam/components/TaskModelScore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";

export default function Passed({
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
      {open && start?.result && !start?.review_pending && (
        <>
          <DotLottieReact
            className="w-full h-screen! mx-auto absolute top-0 right-0  z-9999999999! "
            src="/Animations/Celeberation.json"
            autoplay
          />
        </>
      )}
      <Dialog open={open}>
        <DialogContent className="p-8 max-w-xl bg-white rounded-lg shadow-lg">
          <div className="">
            <div className=" ">
              {!start?.review_pending && start?.result && (
                <DotLottieReact
                  className="w-[112px] h-[112px] mx-auto mb-8"
                  src="/Animations/Confetti.json"
                  autoplay
                  loop
                />
              )}

              <div className="mb-[12px]">
                <div className="flex gap-3  flex-wrap">
                  {start?.review_pending ? (
                    <div className="flex items-center gap-2">
                      <img src="/assets/CorrectColor.svg" />
                      <p className="text-[#121212] inline-block text-lg font-bold">
                        جارى تصحيح الامتحان
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <img src="/assets/CorrectColor.svg" />
                        <span className="text-[#121212] inline-block text-lg font-bold">
                          عمل رائع! حصلت على
                        </span>
                      </div>
                      <TaskModelScore score={score} />
                    </>
                  )}
                </div>
              </div>

              <hr className="h-px my-3 border-gray-light" />

              {start?.review_pending ? (
                <p className="text-[18px] text-[#121212] font-medium mt-6">
                  ستتمكن من عرض اجاباتك بعد تصحيح الامتحان
                </p>
              ) : (
                <>
                  <span className="text-[#121212] inline-block font-medium">
                    إذا قمت بعرض الإجابات مرة أخرى لن تتمكن من إعادة الامتحان
                  </span>
                  <p className="text-[18px] text-[#121212] font-medium mt-6">
                    يمكنك تنزيل نموذج الإجابة بالكامل أو يمكنك تنزيل إجابات
                    الأسئلة التي قمت بالإخطاء في الإجابة عنها
                  </p>
                </>
              )}

              <div className="flex justify-center items-center w-full mx-auto mt-8">
                <div
                  className={cn("grid md:grid-cols-2 justify-center gap-6", {
                    "md:grid-cols-1": start?.review_pending,
                  })}
                >
                  {!start?.review_pending && (
                    <>
                      {start?.show_answer && (
                        <Button
                          onClick={showAnswers}
                          className="h-11 max-w-[184px] w-full font-bold"
                        >
                          عرض الإجابات
                        </Button>
                      )}
                      {start?.retake && (
                        <Button
                          onClick={retake}
                          variant="secondary"
                          className="h-11 max-w-[184px] w-full font-bold"
                        >
                          إعادة الامتحان
                        </Button>
                      )}
                    </>
                  )}

                  <Link href={`/bundles/${SingleCourse}/${room}`}>
                    <Button
                      variant="outline"
                      className="h-11 max-w-[184px] w-full font-bold"
                    >
                      الرجوع للحصه
                    </Button>
                  </Link>

                  {start?.show_answer && !start?.review_pending && (
                    <ExamPDFGenerator taskId={taskId} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
