"use client";

import AssignmentForm from "@/components/forms/AssignmentForm";
import RoomSheet from "@/components/sheets/RoomSheet";
import { useTaskContext } from "@/context/TaskProvider";
import { useTenant } from "@/context/TenantProvider";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import ExamSideInfo from "@/modules/exam/components/ExamSideInfo";
import ExamSideNav from "@/modules/exam/components/ExamSideNav";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";

const AssignmentPage = () => {
  const { templateNumber } = useTenant();

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
          "wrapper mt-[110px] mb-[186px] flex h-[calc(100%-80px)] flex-col items-center gap-8 py-4 lg:flex-row lg:items-start",
          {
            "pointer-events-none opacity-70": isSubmitting,
          },
        )}
      >
        <div
          className={cn(
            "top-[85px] flex flex-col space-y-4 overflow-y-auto max-lg:w-full lg:sticky lg:max-h-[calc(100vh-90px)]",
            {
              "top-29 lg:max-h-[calc(100vh-126px)]": templateNumber == 3,
            },
          )}
        >
          <ExamSideInfo
            data={data}
            start={start}
            setShowRoom={setShowRoom}
            defaultTitle="واجب"
          />

          <ExamSideNav />
        </div>

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
