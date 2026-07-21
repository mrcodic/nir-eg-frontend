"use client";

import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { useQuery } from "@tanstack/react-query";
import ExamChartsAside from "./ExamChartsAside";
import ExamsPointsChart from "./ExamsPointsChart";

export interface ExamsResponse {
  counts: ExamCounts;
  exams: ExamResult[];
}

export interface ExamCounts {
  passed: number;
  failed: number;
  pending: number;
  total: number;
}

export interface ExamResult {
  result_id: number;
  quiz_id: number;
  title: string;
  submitted_at: string;
  percent: number;
  passed: boolean;
  review_pending: boolean;
  required_score: number;
  total_score: number;
  total_score_denominator: number;
  score_ratio: string;
  score_text_ar: string;
}

function StudentTasksOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["/students/exams/overview"],
    queryFn: getClientPrivateData as () => Promise<{ body: ExamsResponse }>,
  });

  if (isLoading) return null;

  const {
    body: { counts, exams },
  } = data || {
    body: { counts: { total: 0, passed: 0, failed: 0 }, exams: [] },
  };

  return (
    <div className="mt-24">
      <RoomHeader icon={"/assets/assignment-colored.svg"} title={"الدرجات"} />

      <div className="grid grid-cols-12 gap-x-4 gap-y-8">
        <ExamChartsAside
          counts={counts}
          className="col-span-12 mt-8 flex flex-col gap-x-12 lg:col-span-4"
        />

        <ExamsPointsChart exams={exams} />
      </div>
    </div>
  );
}

export default StudentTasksOverview;
