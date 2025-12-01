import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ExamPDFGenerator from "@/modules/exam/components/ExamPDFGenerator";
import TaskModelScore from "@/modules/exam/components/TaskModelScore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
      {open && !start?.review_pending && (
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
              {!start?.review_pending && (
                <DotLottieReact
                  className="w-[112px] h-[112px] mx-auto"
                  src="/Animations/Confetti.json"
                  autoplay
                  loop
                />
              )}

              <div className="mb-[12px]">
                <div className="flex gap-3 mt-[32px] flex-wrap">
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
                          عمل رائع! جاوبت على
                        </span>
                      </div>
                      <TaskModelScore score={score} />

                      {/* <div className="relative font-bold -top-2 text-nowrap">
                        {" "}
                        <h3
                          style={{
                            WebkitTextFillColor: "white",
                            WebkitTextStrokeWidth: 1,
                            WebkitTextStrokeColor: "#d9b45c",
                          }}
                          className="textStroke text-[32px] absolute flex items-center -top-[2px]  z-0"
                        >
                          {" "}
                          {score + " "}اسئلة
                        </h3>
                        <h3 className="text-[#1EAD7B] flex items-center absolute z-10 text-[32px]">
                          {score + " "}اسئلة
                        </h3>
                      </div> */}
                    </>
                  )}
                </div>
              </div>

              {start?.review_pending ? (
                <>
                  <div className="h-px my-[12px] bg-gray-light" />

                  <p className="text-[18px] text-[#121212] font-medium mt-6">
                    ستتمكن من عرض اجاباتك بعد تصحيح الامتحان
                  </p>
                </>
              ) : (
                <>
                  <div className="h-px my-[12px] bg-gray-light" />
                  <span className="text-[#121212] inline-block font-medium">
                    إذا قمت بعرض الإجابات مرة أخرى لن تتمكن من إعادة الامتحان
                  </span>
                  <p className="text-[18px] text-[#121212] font-medium mt-6">
                    يمكنك تنزيل نموذج الإجابة بالكامل أو يمكنك تنزيل إجابات
                    الأسئلة التي قمت بالإخطاء في الإجابة عنها
                  </p>
                </>
              )}

              <div className="mb-[32px] flex justify-center items-center w-full mx-auto mt-[32px]">
                <div
                  className={cn("grid md:grid-cols-2 justify-center gap-6", {
                    "md:grid-cols-1": start?.review_pending,
                  })}
                >
                  {!start?.review_pending && (
                    <>
                      {start?.show_answer && (
                        <button
                          onClick={showAnswers}
                          className=" w-full md:w-[172px] bg-primary h-[32px] text-sm font-bold text-white rounded-md border border-gray-light"
                        >
                          عرض الإجابات
                        </button>
                      )}
                      {start?.retake && (
                        <button
                          className="bg-primary-800 py-1 w-full md:w-[172px] borer border-primary px-[12px] font-bold text-white text-sm rounded-lg"
                          onClick={retake}
                        >
                          إعادة الامتحان
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
