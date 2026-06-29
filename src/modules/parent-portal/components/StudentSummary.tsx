"use client";

import ParentPortalTable from "@/components/tables/ParentPortalTable";
import Image from "next/image";
import { useMemo } from "react";
import { IPortalMetaData, IPortalSummaryData } from "../types";
import AttendanceSummary from "./AttendanceSummary";
import ClassroomsSummary from "./ClassroomsSummary";
import PortalHeader from "./PortalHeader";

function StudentSummary({
  data,
  meta,
}: {
  data: IPortalSummaryData;
  meta: IPortalMetaData;
}) {
  const student = data.student;
  const templateType =
    student.type === 4 || student.type === 5 ? "online" : "offline";

  const allQuizzes = useMemo(
    () =>
      templateType === "online"
        ? data?.classrooms?.flatMap((classroom) =>
            classroom?.rooms?.flatMap((room) => room?.quizzes),
          ) || []
        : data?.classrooms?.[0]?.rooms?.flatMap((room) => room?.quizzes) || [],
    [data, templateType],
  );

  return (
    <div>
      {meta?.remaining?.human && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border-2 border-[#D9B45C] bg-[#FBF6F0] p-2">
          <Image
            src="/assets/icons/WarningColor.svg"
            alt="expires at"
            width={20}
            height={20}
          />
          <p className="font-bold text-black">
            تنتهى صلاحية هذا الرابط خلال {meta?.remaining?.human}
          </p>
        </div>
      )}

      {/* page header card */}
      <PortalHeader student={student} templateType={templateType} />

      {/* attendace chart */}
      {templateType === "offline" && data?.attendance && (
        <AttendanceSummary attendance={data?.attendance} />
      )}

      <div className="mt-16 space-y-16">
        {/* online courses table */}
        {templateType === "online" && (
          <ParentPortalTable quizzes={allQuizzes} />
        )}
        <ClassroomsSummary classrooms={data?.classrooms} />
      </div>
    </div>
  );
}

export default StudentSummary;
