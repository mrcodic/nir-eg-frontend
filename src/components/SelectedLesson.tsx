"use client";

import LinkLocked from "@/layouts/LinkLocked";
import { convertMinutes } from "@/utils/clientFun";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { memo } from "react";
import MarkVideoCompleted from "./MarkVideoCompleted";

type SelectedLessonProps = {
  data: any;
  sendData: (videoId: string, lessonId: string) => void;
  locked: boolean;
  videoId: string;
};

const SelectedLesson = ({
  data,
  sendData,
  locked,
  videoId,
}: SelectedLessonProps) => {
  const { SingleCourse, room } = useParams();
  const router = useRouter();

  return (
    <div className="bg-[#f9fafc] overflow-y-auto max-h-[1400px] w-full border border-color-primary rounded-lg p-4">
      <div className="flex items-center gap-2">
        <img src={"/assets/teacher.png"} className="w-[80px] h-[73.059px]" />

        <div className="flex flex-col gap-2">
          <h1 className="text-[18px] text-[#121212] font-bold">
            {data?.room?.title}
          </h1>
        </div>
      </div>
      <div
        onClick={() => {
          router.push(`/bundles/${SingleCourse}`);
        }}
        className="border border-primary-700 cursor-pointer flex items-center justify-center bg-[#012D5A] mt-[24px] py-2 text-white rounded-lg w-full"
      >
        <img src="/assets/LeftArrowColor.svg" />
        <span>العودة للكورس</span>
      </div>

      <div className="h-px w-full bg-primary-700 my-4" />
      {!!data?.quizzes?.length && (
        <>
          <h3 className="text-[#454545] text-[12px] font-bold">الامتحانات</h3>
          {data?.quizzes.map((quiz) => {
            return (
              <div
                key={quiz.id}
                className="flex items-center px-[8px] py-[12px] rounded-[8px] bg-white mt-[15px] justify-between"
              >
                <div className="flex gap-2">
                  <img src="/assets/FillExams.svg" />
                  <h2 className="text-[14px] font-bold text-[#121212] break-all">
                    {quiz?.title}
                  </h2>
                </div>
                <div className="rounded-[8px] h-[32px] border text-white border-primary-700 flex justify-center items-center bg-color-primary w-[68px]">
                  <Link href={`${room}/exams/${quiz.id}`}>
                    <img src="/assets/DownloadColor.svg" />
                  </Link>
                </div>
              </div>
            );
          })}
          <div className="h-px w-full bg-primary-700 my-4" />
        </>
      )}

      {data?.lessons?.map((lesson) => (
        <div
          key={lesson.id}
          onClick={async () => {
            if (locked) return;
            sendData(lesson?.vedio_id, lesson?.id);
          }}
          className={` bg-white border cursor-pointer ${
            videoId !== lesson?.vedio_id
              ? "border-[#1EAD7B]  "
              : "border-[#012D5A] bg-background!"
          } rounded-[8px] mb-[12px] px-[8px]  py-[12px]`}
        >
          <div className="flex text-[14px] items-center font-bold gap-4">
            <img src="/assets/FillVideos.svg" className="w-[24px] h-[24px]" />
            <h3>{lesson?.title}</h3>
          </div>

          <div className="mr-10 flex justify-between mt-[8px]">
            <div className="flex items-center gap-2">
              <img className="w-[20px] h-[20px]" src="/assets/Time.svg" />
              <span className="text-[#523412] flex gap-1 text-[12px] font-medium">
                {" "}
                <span>
                  {isFinite(Number(lesson?.duration))
                    ? convertMinutes(Number(lesson.duration))
                    : lesson.duration}
                </span>
              </span>
            </div>

            <MarkVideoCompleted
              isCompleted={lesson.completed}
              roomId={data?.room?.id}
              classroomId={SingleCourse as string}
              lessonId={lesson?.id}
            />
          </div>
        </div>
      ))}

      {/* DownloadColor */}
      {!!data?.room?.attachments?.length && (
        <div>
          <h3 className="text-[12px] text-[#454545] font-bold">الملفات</h3>

          {data?.room?.attachments?.map((attachment) => {
            return (
              <div
                key={attachment.name}
                className="flex items-center mb-[8px] px-[8px] py-[12px] bg-white rounded-[8px] mt-[10px] justify-between"
              >
                <div className="flex gap-2">
                  <img src="/assets/FillFiles.svg" />
                  <h2 className="text-[14px] font-bold text-[#121212]">
                    {attachment.name}
                  </h2>
                </div>
                <LinkLocked locked={locked}>
                  <a
                    onClick={() => {
                      window.open(attachment.url, "_blank");
                    }}
                    download
                    className="rounded-[8px] cursor-pointer h-[32px] border border-primary-700 flex justify-center items-center bg-color-primary w-[68px]"
                  >
                    <img src="/assets/DownloadColor.svg" />
                  </a>
                </LinkLocked>
              </div>
            );
          })}
        </div>
      )}

      {!!data?.assignments?.length && (
        <div>
          <h3 className="text-[12px] text-[#454545] font-bold">الواجبات</h3>

          {data?.assignments.map((ass) => {
            return (
              <div
                key={ass?.id}
                className="flex items-center px-[8px] py-[12px] rounded-[8px] bg-white mt-[15px] justify-between"
              >
                <div className="flex gap-2">
                  <img src="/assets/FillAssignments.svg" />
                  <h2 className="text-[14px] font-bold text-[#121212] break-all">
                    {ass?.title}
                  </h2>
                </div>
                <LinkLocked locked={locked}>
                  <Link
                    href={`/bundles/${SingleCourse}/${room}/assignment/${ass.id}`}
                    className="rounded-[8px] h-[32px] border border-primary-700 flex justify-center items-center bg-color-primary w-[68px]"
                  >
                    <img src="/assets/DownloadColor.svg" />
                  </Link>
                </LinkLocked>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-[16px]">
        {data?.room?.assignments && (
          <>
            <h3 className="text-[#454545] text-[12px] font-bold">
              الامتحانات و الواجبات
            </h3>

            <div
              style={{
                boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
              }}
              className="p-2 mt-[8px] bg-white flex text-[14px] text-[#121212] border rounded-md border-[#1EAD7B]"
            >
              <img src="/assets/FillFiles.svg" />
              <span>لقد نجحت في الامتحان و حصلت على</span>

              <div className="relative font-bold right-1 top-0 text-nowrap">
                {" "}
                <h3
                  style={{
                    WebkitTextFillColor: "white",
                    WebkitTextStrokeWidth: 1,
                    WebkitTextStrokeColor: "#d9b45c",
                  }}
                  className="textStroke text-[18px] absolute flex items-center -top-[2px]  z-0"
                >
                  {" "}
                  90%
                </h3>
                <h3 className="text-[#1EAD7B] flex items-center absolute z-10 text-[18px]">
                  90%
                </h3>
              </div>
              <button className=" w-[67px] flex gap-2  rounded-[8px] mr-[50px] mt-[2px] border border-[#121212]">
                <img
                  className="w-[20px]  h-[20px]"
                  src="/assets/CorrectColor.svg"
                />
                <span className="text-[#1EAD7B] text-[12px] inline-block font-bold">
                  ناجح
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(SelectedLesson);
