"use client";

import { MyTimer } from "@/components/CountdownTimer";
import ExamForm from "@/components/forms/ExamForm";
import { useTaskContext } from "@/context/TaskProvider";
import ProtectedRoute from "@/layouts/ProtectedRoute";
import { cn } from "@/lib/utils";
import ExamSideInfo from "@/modules/exam/components/ExamSideInfo";
import ExamSideNav from "@/modules/exam/components/ExamSideNav";
import SubmitLoader from "@/modules/exam/components/SubmitLoader";
import Image from "next/image";
import { memo } from "react";

const ExamPage = () => {
  const {
    start,
    isLoading,
    data,
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
          "mx-auto mt-[110px] mb-[186px] flex h-[calc(100%-80px)] w-[85%] flex-col items-center py-4 md:flex-row md:items-start md:gap-10 lg:gap-[122px]",
          { "pointer-events-none opacity-70": isSubmitting },
        )}
      >
        <div
          className={cn(
            "top-[85px] flex flex-col space-y-4 overflow-y-auto max-md:w-full md:sticky md:max-h-[calc(100vh-164px)]",
            {
              "top-[170px] mt-[30px]": startExam,
            },
          )}
        >
          {startExam && (
            <div className="fixed top-[85px] z-[888] flex h-20 w-full max-w-[244px] items-center justify-center rounded-[10px] bg-no-repeat p-2 max-md:right-0 md:p-4">
              <Image
                src={"/assets/Container.svg"}
                fill
                className="object-auto min-h-full min-w-full object-center"
                alt="container image"
              />
              {start?.timer && (
                <div className="relative text-center text-2xl font-bold text-[#B75050]">
                  <MyTimer
                    start={startExam}
                    minutes={start?.timer}
                    onComplete={onComplete}
                  />
                </div>
              )}
            </div>
          )}

          <ExamSideInfo data={data} start={start} />

          <ExamSideNav />
        </div>

        <div className="w-full min-w-[50%] flex-1">
          <div
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
            }}
            className="my-[16px] flex items-center gap-4 rounded-lg bg-[#FBF6F0] p-2"
          >
            <img src="/assets/TimeClock.svg" />
            <div className="flex flex-col gap-2 text-[16px] text-[#121212]">
              <div className="flex gap-2 text-[14px]">
                <span className="font-medium text-[#121212]">وقت الامتحان</span>
                <span className="inline-block font-bold text-[#012D5A]">
                  {start?.timer}
                </span>
                <span className="inline-block font-bold text-[#012D5A]">
                  دقيقة
                </span>
              </div>
            </div>
          </div>

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

export default memo(ExamPage);
