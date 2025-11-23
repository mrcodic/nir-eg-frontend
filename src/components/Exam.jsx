"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const Exam = ({ exam, isPreviousExam }) => {
  const { SingleCourse } = useParams();

  return (
    <div className="flex border p-2 border-primary rounded-lg  gap-[10px]">
      <img className="w-[72px] h-[72px]" src="/assets/ExamsColor.svg" />
      <div className=" grow ">
        <div className="pl-[24px]">
          <div className="flex justify-between w-full">
            <h3 className="text-[18px] font-bold text-[#121212]">
              {exam.title}
            </h3>
          </div>
          <div className="my-[16px] bg-gray-light  h-px" />
        </div>

        <div className="flex flex-wrap justify-between items-center ">
          {exam.time && (
            <div className="flex  gap-2">
              <img className="w-[24px] h-[24px]" src="/assets/time.svg" />
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">مدة الامتحان:</span>
                <span className="text-sm font-bold">{exam.time}</span>
              </div>
            </div>
          )}

          {exam.created_at && (
            <div className="flex gap-2">
              <img className="w-[24px] h-[24px]" src="/assets/Calendar.svg" />
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">تاريخ الامتحان:</span>
                <span className="text-sm font-bold">
                  {new Date(exam.created_at).toDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* <h3 className="text-right text-sm text-gray-dark">
          محتوى الحصة الأولى
        </h3> */}
      </div>

      <Link
        href={`/bundles/${SingleCourse}/exams/${exam.id}`}
        className="flex items-center gap-2 rounded-lg self-end py-2 px-2 text-white bg-primary border border-gray-light"
      >
        <h3 className="hidden md:block">الذهاب للامتحان</h3>
        <img src="/assets/LeftArrowColor.svg" />
      </Link>

      {isPreviousExam && (
        <button className="border  font-bold flex gap-2 p-1 self-end rounded-lg w-[136px] border-[#121212]">
          <img src="/assets/CorrectColor.svg" />
          <span className="text-[16px] inline-block text-[#1EAD7B]">ناجح</span>
          <div className="relative right-1  hidden md:flex   -top-1">
            {" "}
            <h3 className="textStroke text-[20px] absolute  items-center   z-0">
              {" "}
              <span>%</span>
              <span>90</span>
            </h3>
            <h3 className="text-[#1EAD7B] flex items-center font-bold relative top-[2px] z-10 text-[20px]">
              <span>%</span>
              <span>90</span>
            </h3>
          </div>
        </button>
      )}
    </div>
  );
};
export default Exam;
