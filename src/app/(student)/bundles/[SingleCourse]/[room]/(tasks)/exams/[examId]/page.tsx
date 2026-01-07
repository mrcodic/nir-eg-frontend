"use client";

import ExamForm from "@/components/forms/ExamForm";
import RoomSheet from "@/components/sheets/RoomSheet";
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
    showRoom,
    setShowRoom,
    startExam,
    setStartExam,
    onComplete,
    isSubmitting,
  } = useTaskContext();

  return (
    <ProtectedRoute
      data={start}
      isLoading={isLoading}
      subscribed={start?.is_subscribed}
      verify={true}
    >
      <div
        className={cn(
          "wrapper group- mt-28 mb-[186px] flex h-[calc(100%-80px)] flex-col items-center gap-8 py-4 group-data-[template=landing-v3]/template:mt-32 md:items-start md:gap-10 lg:flex-row lg:gap-8",
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
            setShowRoom={setShowRoom}
            startTimer={startExam && !!start?.timer}
            onComplete={onComplete}
          />

          <ExamSideNav />
        </div>

        <div className="w-full min-w-[50%] flex-1">
          <ExamForm start={start} setStartExam={setStartExam} />
        </div>

        {showRoom && <RoomSheet open={showRoom} setOpen={setShowRoom} />}

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default ExamPage;
