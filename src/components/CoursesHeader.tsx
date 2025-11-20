"use client";

import { IUser } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import CourseInfoBadge from "./CourseInfoBadge";
import SupportBadge from "./SupportBadge";

const CoursesHeader = ({ body }) => {
  const COURSEDETAILS = [
    {
      icon: "/assets/Time.svg",
      label: " الكورس متاح لمده:",
      // title: convertMinutes(Number(body?.classroom_price)),
      title: body?.is_subscriped
        ? body?.classroom_expired_after
        : body?.classroom_duration,
      specification: "يوم",
    },

    {
      icon: "/assets/Update.svg",
      label: "تاريخ آخر تحديث:",
      title: body?.last_updated,
    },
  ];

  const { data } = useQuery({
    queryFn: getDataClient as () => Promise<{ body: IUser }>,
    queryKey: ["/students/profile"],
  });

  // console.log("🚀 ~ CoursesHeader ~ body:", body);

  const subType = body?.subscription_type;

  return (
    <div
      className={`relative  bg-[#012D5Af8] 
       
      `}
    >
      <div className="relative ">
        <div className="absolute inset-0 -z-1 ">
          <Image
            src="/assets/Background.svg"
            alt=""
            fill
            className="object-contain top-[10px] object-bottom-left -z-1"
            priority
          />
          <Image
            src="/assets/paper.png"
            alt=""
            fill
            className="object-cover opacity-40  z-10"
            priority
          />
        </div>

        <div className="md:w-[85%] min-h-[400px]  mx-auto  p-4 pb-10 h-full ">
          <div className="flex gap-6 flex-wrap  h-full items-center justify-between pt-[48px]">
            <div className="flex flex-wrap gap-2  md:justify-start md:gap-6     md:max-w-[70%]  grow">
              <CourseInfoBadge
                value={body?.total_lessons_count}
                text="فيديوهات"
                icon="/assets/FillVideos.svg"
              />

              <CourseInfoBadge
                value={body?.total_quizzes_count}
                text="امتحانات"
                icon="/assets/FillExams.svg"
              />
              <CourseInfoBadge
                value={body?.total_assignm_count}
                text="واجبات"
                icon="/assets/FillAssignments.svg"
              />
              <CourseInfoBadge
                value={body?.totalMaterialCount}
                text="ملفات"
                icon="/assets/FillFiles.svg"
              />
            </div>

            {body?.is_subscriped &&
              (data?.body?.type == 4 || data?.body?.type == 5) && (
                <SupportBadge gradeId={body?.grade_id} />
              )}
          </div>

          <div className="mt-[56px] flex w-full justify-between">
            <h2 className=" text-[18px] md:text-[28px] text-white">
              {" "}
              {body?.classroom}
            </h2>
            {subType !== "حصة" &&
              (body?.classroom_price || body?.is_subscriped) && (
                <div className="w-[100px] bg-[#F6EADE] text-[12px] md:text-[16px] text-[#523412] font-bold flex items-center justify-center rounded-lg text-center">
                  {body?.is_subscriped
                    ? "مشترك"
                    : `${Number(body?.classroom_price).toFixed(2)} جنيه`}
                </div>
              )}
          </div>
          <div className="h-px w-full bg-primary-700 my-[12px]" />
          <h3 className="text-[#F6EADE] text-sm md:text-[20px] mb-[56px]">
            {body?.grade}
          </h3>

          <div className="flex flex-wrap gap-[40px]">
            {COURSEDETAILS.map((detail) => {
              if (!detail.title) return;

              return (
                <div
                  key={detail.label}
                  className="flex items-center  gap-[8px]"
                >
                  <img
                    className="w-[16px] h-[16px] md:w-[24px] md:h-[24px]"
                    src={detail.icon}
                    alt={detail.title}
                  />
                  <div className="flex  items-center gap-1">
                    <h2 className="text-[10px] md:text-sm text-[#DEC5AB] font-bold whitespace-nowrap">
                      {detail.label}
                    </h2>
                    <span className="text-[#DEC5AB] text-[10px] md:text-sm font-medium inline-block whitespace-nowrap">
                      {detail.title}
                      {detail.specification}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CoursesHeader;
