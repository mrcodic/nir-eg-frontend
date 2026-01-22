"use client";

import { useAuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { ICourseDetails } from "@/types";
import Image from "next/image";
import { useMemo } from "react";
import PriceBadge from "../modules/payment/components/PriceBadge";
import CourseInfoBadge from "./CourseInfoBadge";
import SupportBadge from "./SupportBadge";
import DataWithLabel from "./ui/DataWithLabel";

const CoursesHeader = ({ details }: { details: ICourseDetails }) => {
  const { profile } = useAuthContext();

  const COURSEDETAILS = useMemo(
    () => [
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
    ],
    [details],
  );

  const subType = details?.subscription_type;

  return (
    <div
      className={cn(
        `bg-primary-radial relative mt-20 group-data-[template=landing-v3]/template:mt-0 group-data-[template=landing-v3]/template:pt-28`,
        //    {
        //   "mt-0 pt-28": template == 3,
        // }
      )}
    >
      <div className="absolute inset-0 z-1">
        <Image
          src="/assets/bg/bg.png"
          alt=""
          fill
          className="top-2.5 -z-1 object-contain object-bottom-left"
          priority
        />
      </div>

      <div className="relative z-2">
        <div className="wrapper flex h-full flex-col pb-20">
          <div className="flex h-full flex-wrap items-center justify-between gap-6 pt-12">
            <div className="flex grow flex-wrap gap-2 md:max-w-[70%] md:justify-start md:gap-6">
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
              (profile?.type == 4 || profile?.type == 5) && (
                <SupportBadge gradeId={details?.grade_id} />
              )}
          </div>

          <div className="mt-14 flex w-full justify-between">
            <h2 className="md:text-28 text-[18px] text-white">
              {details?.classroom}
            </h2>

            {subType !== "حصة" &&
              (details?.classroom_price || details?.is_subscriped) &&
              (details?.is_subscriped ? (
                <span className="bg-semantics-green-dark flex h-8 items-center gap-2 rounded-lg ps-2 pe-3 text-lg text-white">
                  <Image
                    src="/assets/success.svg"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                    alt="success icon"
                  />
                  <span>مشترك</span>
                </span>
              ) : (
                <PriceBadge price={Number(details?.classroom_price)} />
              ))}
          </div>

          <div className="bg-gray-light my-3 h-px w-full" />

          <h3 className="text-gray-light mb-6 text-sm empty:hidden md:text-[20px]">
            {details?.grade_name}
          </h3>

          <div className="mt-auto flex flex-wrap gap-10">
            {COURSEDETAILS.map((detail) => {
              if (!detail.title) return;

              return (
                <DataWithLabel
                  key={detail.label}
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
