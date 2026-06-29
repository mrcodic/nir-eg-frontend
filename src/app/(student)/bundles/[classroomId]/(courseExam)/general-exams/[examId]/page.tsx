"use client";

import ExamForm from "@/components/forms/ExamForm";
import { useTaskContext } from "@/context/TaskProvider";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";
import TaskSideBar from "@/modules/exam/components/TaskSideBar";

const ExamPage = () => {
  const {
    start,
    isLoading,
    data,
    startExam,
    setStartExam,
    onComplete,
    isSubmitting,
    isTaskClosed,
  } = useTaskContext();

  return (
    <ProtectedRoute
      data={start}
      isLoading={isLoading}
      subscribed={start?.is_subscribed}
      text={isTaskClosed ? "تم إغلاق الامتحان" : ""}
    >
      <title>{start?.title}</title>
      <meta
        name="description"
        content={`حل امتحان شامل ${start?.title || ""}`}
      />

      <div
        className={cn(
          "wrapper mt-28 mb-[186px] flex h-[calc(100%-80px)] flex-col items-center gap-8 py-4 group-data-[template=landing-v3]/template:mt-32 md:items-start lg:flex-row",
        )}
      >
        <TaskSideBar
          data={data}
          start={start}
          startTimer={startExam && !!start?.timer}
          onComplete={onComplete}
        />

        <div className="flex-1 self-stretch">
          <ExamForm
            start={start}
            setStartExam={setStartExam}
            examType="general"
          />
        </div>

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default ExamPage;
