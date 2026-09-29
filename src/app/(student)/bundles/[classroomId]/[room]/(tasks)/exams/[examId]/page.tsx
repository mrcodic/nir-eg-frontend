"use client";

import ExamForm from "@/components/forms/ExamForm";
import RoomSheet from "@/components/sheets/RoomSheet";
import { useTaskContext } from "@/context/TaskProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import ExamTaskTimer from "@/modules/exam/components/ExamTaskTimer";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";
import TaskSideBar from "@/modules/exam/components/TaskSideBar";

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
    isTaskClosed,
  } = useTaskContext();
  const [isMobile] = useMediaQuery("(max-width: 1023px)");
  const timer =
    startExam && start?.timer ? (
      <ExamTaskTimer
        minutes={start.timer}
        onComplete={onComplete}
        className="lg:mt-4"
      />
    ) : null;

  return (
    <ProtectedRoute
      data={start}
      isLoading={isLoading}
      subscribed={start?.is_subscribed}
      text={isTaskClosed ? "تم إغلاق الكويز" : ""}
      emptyMessage="لم يتم العثور على هذا الكويز"
    >
      <title>{start?.title}</title>
      <meta name="description" content={`حل كويز ${start?.title || ""}`} />

      <div
        className={cn(
          "wrapper mt-28 mb-[186px] flex h-[calc(100%-80px)] flex-col items-center gap-8 py-4 group-data-[template=landing-v3]/template:mt-32 md:items-start lg:flex-row",
          // {
          //   "mt-32": template == 3,
          // },
        )}
      >
        {isMobile && timer && (
          <div className="sticky top-22 z-20 w-full group-data-[template=landing-v3]/template:top-24 lg:hidden">
            {timer}
          </div>
        )}

        <TaskSideBar
          data={data}
          start={start}
          setShowRoom={setShowRoom}
          timer={isMobile ? null : timer}
        />

        <div className="flex-1 self-stretch">
          <ExamForm start={start} setStartExam={setStartExam} />
        </div>

        {showRoom && <RoomSheet open={showRoom} setOpen={setShowRoom} />}

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default ExamPage;
