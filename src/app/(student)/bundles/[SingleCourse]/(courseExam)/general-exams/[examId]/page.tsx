"use client";

import ExamForm from "@/components/forms/ExamForm";
import { useTaskContext } from "@/context/TaskProvider";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import ExamSideInfo from "@/modules/exam/components/ExamSideInfo";
import ExamSideNav from "@/modules/exam/components/ExamSideNav";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";

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
      <div
        className={cn(
          "wrapper mt-28 mb-[186px] flex h-[calc(100%-80px)] flex-col items-center gap-8 py-4 group-data-[template=landing-v3]/template:mt-32 md:items-start lg:flex-row",
          // {
          //   "mt-32": template == 3,
          // },
        )}
      >
        <div
          className={cn(
            "top-[85px] flex flex-col space-y-4 overflow-y-auto group-data-[template=landing-v3]/template:top-29 max-lg:w-full lg:sticky lg:max-h-[calc(100vh-90px)] group-data-[template=landing-v3]/template:lg:max-h-[calc(100vh-126px)]",
            // {
            //   "top-29 lg:max-h-[calc(100vh-126px)]": template == 3,
            // },
          )}
        >
          <ExamSideInfo
            data={data}
            start={start}
            startTimer={startExam && !!start?.timer}
            onComplete={onComplete}
          />

          <ExamSideNav />
        </div>

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
