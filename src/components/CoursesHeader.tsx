"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { getCurrentTemplate } from "@/helpers/sass";
import { cn } from "@/lib/utils";
import { ICourseDetails, IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import CourseInfoBadge from "./CourseInfoBadge";
import SupportBadge from "./SupportBadge";
import DataWithLabel from "./ui/DataWithLabel";
import PriceBadge from "./ui/PriceBadge";

const CoursesHeader = ({ details }: { details: ICourseDetails }) => {
  const template = getCurrentTemplate();

  const COURSEDETAILS = [
    {
      icon: "/assets/time.svg",
      label: " الكورس متاح لمده:",
      // title: convertMinutes(Number(body?.classroom_price)),
      title: details?.is_subscriped
        ? details?.classroom_expired_after
        : details?.classroom_duration,
      specification: "ايام",
    },

    {
      icon: "/assets/calendar.svg",
      label: "تاريخ آخر تحديث:",
      title: details?.last_updated,
    },
  ];

  const { data } = useQuery({
    queryFn: getClientPrivateData as () => Promise<{ body: IUser }>,
    queryKey: ["/students/profile"],
  });

  // console.log("🚀 ~ CoursesHeader ~ body:", body);

  const subType = details?.subscription_type;

  return (
    <div
      className={cn(`relative  bg-primary-radial mt-20`, {
        "mt-0 pt-28": template == 3,
      })}
    >
      <div className="absolute inset-0 z-1 ">
        <Image
          src="/assets/bg/bg.png"
          alt=""
          fill
          className="object-contain top-[10px] object-bottom-left -z-1"
          priority
        />
      </div>

      <div className="relative z-2">
        <div className="wrapper pb-20 h-full flex flex-col ">
          <div className="flex gap-6 flex-wrap  h-full items-center justify-between pt-12">
            <div className="flex flex-wrap gap-2  md:justify-start md:gap-6 md:max-w-[70%]  grow">
              <CourseInfoBadge
                value={details?.total_lessons_count}
                text="فيديو"
                icon="/assets/videos-fill.svg"
              />

              <CourseInfoBadge
                value={details?.total_quizzes_count}
                text="امتحان"
                icon="/assets/exam-fill.svg"
              />
              <CourseInfoBadge
                value={details?.total_assignm_count}
                text="واجب"
                icon="/assets/assignment-fill.svg"
              />
              <CourseInfoBadge
                value={details?.totalMaterialCount}
                text="ملف"
                icon="/assets/files-fill.svg"
              />
            </div>

            {details?.is_subscriped &&
              (data?.body?.type == 4 || data?.body?.type == 5) && (
                <SupportBadge gradeId={details?.grade_id} />
              )}
          </div>

          <div className="mt-14 flex w-full justify-between">
            <h2 className=" text-[18px] md:text-28 text-white">
              {details?.classroom}
            </h2>

            {subType !== "حصة" &&
              (details?.classroom_price || details?.is_subscriped) &&
              (details?.is_subscriped ? (
                <span className="text-white bg-semantics-green-dark ps-2 pe-3 rounded-lg flex items-center text-lg gap-2 h-8">
                  <Image
                    src="/assets/success.svg"
                    width={24}
                    height={24}
                    className="invert brightness-0"
                    alt="success icon"
                  />
                  <span>مشترك</span>
                </span>
              ) : (
                <PriceBadge price={Number(details?.classroom_price)} />
              ))}
          </div>

          <div className="h-px w-full bg-gray-light my-3" />

          <h3 className="text-gray-light text-sm md:text-[20px] mb-6 empty:hidden">
            {details?.grade_name}
          </h3>

          <div className="flex flex-wrap gap-10 mt-auto">
            {COURSEDETAILS.map((detail) => {
              if (!detail.title) return;

              return (
                <DataWithLabel
                  className="gap-1"
                  label={detail.label}
                  data={detail?.title + " " + (detail?.specification || "")}
                  labelClassName="text-xs text-gray-light"
                  dataClassName="text-sm text-white"
                  icon={
                    <Image
                      src={detail.icon}
                      width={20}
                      height={20}
                      alt="calendar icon"
                    />
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CoursesHeader;
