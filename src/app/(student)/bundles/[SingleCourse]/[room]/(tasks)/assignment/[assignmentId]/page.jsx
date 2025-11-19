"use client";

import AssignmentForm from "@/components/forms/AssignmentForm";
import RoomSheet from "@/components/sheets/RoomSheet";
import { useTaskContext } from "@/context/TaskProvider";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import ExamSideInfo from "@/modules/exam/components/ExamSideInfo";
import ExamSideNav from "@/modules/exam/components/ExamSideNav";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";

const AssignmentPage = () => {
  const { start, isLoading, data, showRoom, setShowRoom, isSubmitting } =
    useTaskContext();

  return (
    <ProtectedRoute
      isLoading={isLoading}
      data={start}
      subscribed={start?.is_subscribed}
      text="لم يعد مسموح بالوصول الى هذه الصفحة"
      verify={true}
    >
      <div
        className={cn(
          "py-4 flex flex-col md:flex-row items-center md:items-start mb-[186px] h-[calc(100%-80px)] mt-[110px] md:gap-10 lg:gap-[122px] mx-auto w-[85%] ",
          {
            "pointer-events-none opacity-70": isSubmitting,
          }
        )}
      >
        <div className="space-y-4 md:sticky top-[85px] max-md:w-full md:max-h-[calc(100vh-80px)] overflow-y-auto">
          <ExamSideInfo
            data={data}
            start={start}
            setShowRoom={setShowRoom}
            defaultTitle="واجب"
          />

          <ExamSideNav />
        </div>

        <div className="flex-1  min-w-[50%]">
          <AssignmentForm start={start} data={data} />
        </div>

        <RoomSheet open={showRoom} setOpen={setShowRoom} />

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default AssignmentPage;
