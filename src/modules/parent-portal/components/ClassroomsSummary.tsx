"use client";

import RoomHeader from "@/modules/rooms/components/RoomHeader";
import ExamsPointsChart from "@/modules/profile/components/ExamsPointsChart";
import Image from "next/image";

import ExamChartsAside from "@/modules/profile/components/ExamChartsAside";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { IPortalClassroom } from "../types";

function ClassroomCard({ classroom }: { classroom: IPortalClassroom }) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "100px",
  });

  return (
    <div
      ref={ref}
      id={`classroom-chart-${classroom?.title}`}
      className="grid min-h-[400px] grid-cols-12 gap-x-6 gap-y-8"
    >
      <RoomHeader
        className="col-span-full mb-0"
        title={classroom?.title}
        icon="/assets/ExamsColor.svg"
        textClassName="text-wrap"
      />

      {inView ? (
        <>
          <div className="col-span-12 mt-8 lg:col-span-4">
            <div className="border-secondary flex flex-col gap-4 border-b py-4">
              <div className="flex items-center gap-4">
                <Image src="/assets/Done.svg" width={32} height={32} alt="" />
                <h4 className="text-lg font-bold">نسبة الانتهاء من الكورس</h4>
              </div>

              <div className="flex items-center gap-2 ps-12 text-lg font-bold">
                <div className="relative h-2 w-full rounded-lg bg-[#F2F2F2]">
                  <div
                    className="h-2 rounded-lg bg-[#1EAD7B]"
                    style={{ width: `${classroom?.progress}%` }}
                  />
                </div>
                <span className="text-28">{classroom?.progress}%</span>
              </div>
            </div>

            <ExamChartsAside counts={classroom?.counts} />
          </div>

          <ExamsPointsChart
            exams={classroom?.rooms?.flatMap((room) => room?.quizzes) || []}
          />
        </>
      ) : (
        <div className="col-span-full flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-400">جاري التحميل...</div>
        </div>
      )}
    </div>
  );
}

function ClassroomsSummary({ classrooms }: { classrooms: IPortalClassroom[] }) {
  return (
    <div className="space-y-16">
      {classrooms?.map((classroom, index) => (
        <ClassroomCard key={classroom?.id || index} classroom={classroom} />
      ))}
    </div>
  );
}

export default ClassroomsSummary;
