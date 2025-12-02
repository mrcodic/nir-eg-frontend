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
      <div className="py-4  flex flex-col md:flex-row items-center md:items-start mb-[186px] h-[calc(100%-80px)] mt-[110px] md:gap-10 lg:gap-[122px] wrapper">
        <div
          className={cn(
            "  flex flex-col  space-y-4 md:sticky top-[85px] max-md:w-full md:max-h-[calc(100vh-80px)] overflow-y-auto"
          )}
        >
          <ExamSideInfo
            data={data}
            start={start}
            setShowRoom={setShowRoom}
            startTimer={startExam && start?.timer}
            onComplete={onComplete}
          />

          <ExamSideNav />
        </div>

        <div className="flex-1  w-full min-w-[50%]">
          <div
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
            }}
            className=" gap-4 rounded-lg my-[16px] bg-background  p-2 flex items-center"
          >
            <img src="/assets/TimeClock.svg" />

            <div className="text-[16px] flex flex-col gap-2  text-[#121212]">
              <div className="flex  text-sm gap-2">
                <span className="text-[#121212] font-medium">وقت الامتحان</span>
                <span className="text-primary-800 font-bold inline-block">
                  {start?.timer}
                </span>
                <span className="text-primary-800 font-bold inline-block">
                  دقيقة
                </span>
              </div>
            </div>
          </div>

          <ExamForm start={start} setStartExam={setStartExam} />
        </div>

        <RoomSheet open={showRoom} setOpen={setShowRoom} />

        <SubmitLoader isSubmitting={isSubmitting} />
      </div>
    </ProtectedRoute>
  );
};

export default ExamPage;
