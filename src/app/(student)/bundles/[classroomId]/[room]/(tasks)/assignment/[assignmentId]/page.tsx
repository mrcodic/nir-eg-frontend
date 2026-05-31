"use client";

import AssignmentForm from "@/components/forms/AssignmentForm";
import RoomSheet from "@/components/sheets/RoomSheet";
import { useTaskContext } from "@/context/TaskProvider";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";
import TaskSideBar from "@/modules/exam/components/TaskSideBar";

const AssignmentPage = () => {
  const {
    start,
    isLoading,
    data,
    showRoom,
    setShowRoom,
    isSubmitting,
    isTaskClosed,
  } = useTaskContext();

  return (
    <ProtectedRoute
      isLoading={isLoading}
      data={start}
      subscribed={start?.is_subscribed}
      text={
        isTaskClosed ? "تم إغلاق الواجب" : "لم يعد مسموح بالوصول الى هذه الصفحة"
      }
    >
      <div
        className={cn(
          "wrapper mt-[110px] mb-[186px] flex flex-col items-center gap-8 py-4 lg:flex-row lg:items-start",
          {
            "pointer-events-none opacity-70": isSubmitting,
          },
        )}
      >
        <TaskSideBar
          data={data}
          start={start}
          setShowRoom={setShowRoom}
          defaultTitle="واجب"
        />

        <div className="flex-1 self-stretch">
          <AssignmentForm start={start} />
        </div>

        {showRoom && <RoomSheet open={showRoom} setOpen={setShowRoom} />}

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default AssignmentPage;
