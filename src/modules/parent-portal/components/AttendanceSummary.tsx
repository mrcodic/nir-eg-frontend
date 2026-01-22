"use client";

import RoomHeader from "@/components/RoomHeader";
import { ChartAsideItem } from "@/modules/profile/components/ExamChartsAside";
import { IPortalSummaryData } from "../types";
import AttendanceChart from "./AttendanceChart";

function AttendanceSummary({
  attendance,
}: {
  attendance: IPortalSummaryData["attendance"];
}) {
  return (
    <div className="mt-16">
      <RoomHeader
        className="col-span-full mb-8"
        title="الغياب"
        icon="/assets/ExamsColor.svg"
      />
      <div className="grid grid-cols-12 items-center gap-x-6 gap-y-8">
        <div className="col-span-12 lg:col-span-4">
          <ChartAsideItem
            title="عدد الحصص"
            icon="/assets/ExamsColor.svg"
            value={attendance?.total}
            valueLabel="حصة"
          />

          <ChartAsideItem
            title="حضور"
            icon="/assets/CorrectColor.svg"
            value={attendance?.attend}
            valueLabel="حصة"
            color="text-[#1EAD7B]"
          />

          <ChartAsideItem
            title="غياب"
            icon="/assets/Close2.svg"
            value={attendance?.absent}
            valueLabel="حصة"
            color="text-[#B75050]"
            isLast
          />
        </div>

        <AttendanceChart attendance={attendance} />
      </div>
    </div>
  );
}

export default AttendanceSummary;
