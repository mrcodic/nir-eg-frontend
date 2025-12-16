"use client";

import ExamForm from "@/components/forms/ExamForm";
import RoomSheet from "@/components/sheets/RoomSheet";
import { useTaskContext } from "@/context/TaskProvider";
import { getCurrentTemplate } from "@/helpers/template.helpers";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import ExamSideInfo from "@/modules/exam/components/ExamSideInfo";
import ExamSideNav from "@/modules/exam/components/ExamSideNav";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";

const ExamPage = () => {
  const template = getCurrentTemplate();
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
          "py-4  flex flex-col lg:flex-row items-center md:items-start mb-[186px] h-[calc(100%-80px)] mt-28 gap-8 md:gap-10 lg:gap-8 wrapper",
          {
            "mt-32": template == 3,
          }
        )}
      >
        <div
          className={cn(
            "  flex flex-col  space-y-4 lg:sticky top-[85px] max-lg:w-full lg:max-h-[calc(100vh-126px)] overflow-y-auto",
            {
              "top-29 lg:max-h-[calc(100vh-126px)]": template == 3,
            }
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

        <div className="flex-1  w-full min-w-[50%]">
          <ExamForm start={start} setStartExam={setStartExam} />
        </div>

        {showRoom && <RoomSheet open={showRoom} setOpen={setShowRoom} />}

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default ExamPage;
