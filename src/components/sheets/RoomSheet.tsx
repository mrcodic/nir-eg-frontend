import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import LinkLocked from "@/layouts/LinkLocked";
import { convertMinutes, mapGradeToText } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RoomSheet({ open, setOpen }) {
  const { room, SingleCourse } = useParams();
  const { grade } = useAuthContext();

  const { data } = useQuery({
    queryKey: [`students/get-lessons/${room}`],
    queryFn: getClientPrivateData,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto px-2">
        <div className="max-w-[512px] ps-4 h-full  bg-white rounded-tl-[8px] py-[80px] rounded-bl-[8px] ">
          <div className="">
            <div className="flex gap-6 flex-wrap justify-center items-center">
              <img
                className="w-[80px] h-[73.059px]"
                src="/assets/teacher.png"
              />
              <div className="flex flex-col gap-2">
                <h2 className="text-[18px] font-bold text-[#121212]">
                  {data?.body?.room?.title}
                </h2>
                <span className="text-gray-dark inline-block text-sm">
                  {mapGradeToText(grade)}
                </span>
              </div>
            </div>

            <div className="h-px my-[16px] bg-gray-light" />
            {(!!data?.body?.quizzes?.length ||
              !!data?.body?.assignments?.length) && (
              <>
                <h3 className="text-gray-dark text-[12px] font-bold">
                  الامتحانات و الدروس
                </h3>
                {data?.body?.quizzes.map((quiz, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-[8px] py-[6px] rounded-lg bg-white flex-wrap mt-[15px] justify-between"
                    >
                      <div className="flex gap-2">
                        <img src="/assets/exam-fill.svg" />
                        <h2 className="text-sm font-bold text-[#121212] break-all">
                          {quiz?.title}
                        </h2>
                      </div>

                      <Link
                        href={`/bundles/${SingleCourse}/${room}/exams/${quiz.id}`}
                        className="rounded-lg  ms-auto h-[32px] border border-gray-light flex justify-center items-center bg-primary w-[68px]"
                      >
                        <img src="/assets/LeftArrowColor.svg" />
                      </Link>
                    </div>
                  );
                })}
                {/* {data?.body?.assignments.map((ass) => {
                  return (
                    <div className="flex items-center px-[8px] py-[6px] rounded-lg bg-white mt-[15px] justify-between">
                      <div className="flex gap-2">
                        <img src="/assets/assignment-fill.svg" />
                        <h2 className="text-sm font-bold text-[#121212]">
                          {ass?.title}
                        </h2>
                      </div>
                    </div>
                  );
                })} */}
              </>
            )}

            <div className="h-px my-[8px] bg-gray-light" />

            <div className="flex flex-col gap-[6px]">
              {data?.body?.lessons.map((lesson, index) => (
                <Link
                  key={index}
                  href={`/bundles/${SingleCourse}/${room}?vedio_id=${lesson?.vedio_id}`}
                  // onClick={async () => {
                  //   sendData(lesson?.vedio_id);

                  //   router.push(
                  //     `/bundles/${SingleCourse}/${data?.body?.room?.id}?vedio_id=${lesson?.vedio_id}`
                  //   );
                  // }}
                  className={` bg-white  cursor-pointer
                   rounded-lg mb-[12px] flex gap-4 p-[8px]`}
                >
                  <img
                    className="w-[24px] h-[24px]"
                    src="/assets/videos-fill.svg"
                  />
                  <div>
                    <h3 className="text-sm text-[#121212] font-bold">
                      {lesson.title}
                    </h3>
                    <div className="mt-[8px] items-center flex gap-2">
                      <img
                        className="w-[20px] h-[20px]"
                        src="/assets/time.svg"
                      />
                      <span className="text-sm font-medium">
                        {isFinite(Number(lesson?.duration))
                          ? convertMinutes(Number(lesson.duration))
                          : lesson.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {data?.body?.room?.attachments?.length > 0 && (
              <>
                <div className="h-px my-[8px] bg-gray-light" />

                <h3 className="text-[12px] text-gray-dark font-bold">
                  الملفات
                </h3>
                {data?.body?.room?.attachments?.map((attachment, index) => {
                  return (
                    <div
                      key={index}
                      className="flex gap-2 flex-wrap items-center mb-[8px] px-[8px] py-[6px] bg-white rounded-lg mt-[10px] justify-between"
                    >
                      <div className="flex gap-2">
                        <img src="/assets/files-fill.svg" />
                        <h2 className="text-sm font-bold text-[#121212]">
                          {attachment.name}
                        </h2>
                      </div>

                      <LinkLocked
                        locked={data?.body?.locked_to_pass}
                        className="ms-auto"
                      >
                        <a
                          onClick={() => {
                            window.open(attachment.url, "_blank");
                          }}
                          download
                          className="rounded-lg cursor-pointer h-[32px] border border-gray-light flex justify-center items-center bg-primary w-[68px]"
                        >
                          <img src="/assets/DownloadColor.svg" />
                        </a>
                      </LinkLocked>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
