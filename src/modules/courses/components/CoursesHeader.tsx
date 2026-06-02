"use client";

import GroupJoinBadge from "@/components/shared/GroupJoinBadge";
import DataWithLabel from "@/components/ui/DataWithLabel";
import SubbedBadge from "@/components/ui/SubbedBadge";
import { useAuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import PriceBadge from "@/modules/payment/components/PriceBadge";
import { ICourseDetails } from "@/types";
import { useMemo } from "react";
import CourseInfoBadge from "./CourseInfoBadge";

const CoursesHeader = ({ details }: { details: ICourseDetails }) => {
  const { profile } = useAuthContext();

  const COURSEDETAILS = useMemo(
    () => [
      {
        icon: "/assets/time.svg",
        label: "الكورس متاح لمده",
        title: details?.is_subscriped
          ? details?.classroom_expired_after
          : details?.classroom_duration,
        specification: "ايام",
      },

      {
        icon: "/assets/calendar.svg",
        label: "تاريخ آخر تحديث",
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
      )}
    >
      <div
        className="bg-primary-800 absolute inset-0 z-1"
        style={{
          maskImage: `url(/assets/bg/bg.png)`,
          maskRepeat: "no-repeat",
          maskSize: "contain",
        }}
      />

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
                icon="/assets/icons/exam-fill.svg"
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
              profile?.type != 3 &&
              details?.grade_group_link && (
                <GroupJoinBadge groupLink={details?.grade_group_link} />
              )}
          </div>

          <div className="mt-14 flex w-full justify-between">
            <h2 className="md:text-28 text-[18px] text-white">
              {details?.classroom}
            </h2>

            {subType !== "حصة" &&
              (details?.classroom_price || details?.is_subscriped) &&
              (details?.is_subscriped ? (
                <SubbedBadge />
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
                    <div
                      style={{
                        maskImage: `url(${detail.icon})`,
                        maskRepeat: "no-repeat",
                        maskSize: "contain",
                      }}
                      className="bg-primary-800 size-5"
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
