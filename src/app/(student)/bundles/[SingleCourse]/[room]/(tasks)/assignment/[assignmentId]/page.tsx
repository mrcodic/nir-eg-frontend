"use client";

import AssignmentForm from "@/components/forms/AssignmentForm";
import RoomSheet from "@/components/sheets/RoomSheet";
import { useTaskContext } from "@/context/TaskProvider";
import { getCurrentTemplate } from "@/helpers/template.helpers";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import ExamSideInfo from "@/modules/exam/components/ExamSideInfo";
import ExamSideNav from "@/modules/exam/components/ExamSideNav";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";

const AssignmentPage = () => {
  const template = getCurrentTemplate();

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
          "mx-auto mt-[110px] mb-[186px] flex h-[calc(100%-80px)] w-[85%] flex-col items-center py-4 md:flex-row md:items-start md:gap-10 lg:gap-[122px]",
          {
            "pointer-events-none opacity-70": isSubmitting,
          },
        )}
      >
        <div
          className={cn(
            "top-[85px] flex flex-col space-y-4 overflow-y-auto max-lg:w-full lg:sticky lg:max-h-[calc(100vh-90px)]",
            {
              "top-29 lg:max-h-[calc(100vh-126px)]": template == 3,
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

        <div className="min-w-[50%] flex-1">
          <AssignmentForm start={start} />
        </div>

        <RoomSheet open={showRoom} setOpen={setShowRoom} />

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default AssignmentPage;
