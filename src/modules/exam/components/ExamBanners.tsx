import TopBanner from "@/components/banners/TopBanner";

import Image from "next/image";
import { memo } from "react";

export const TargetGradeBanner = memo(({ score }: { score: number }) => {
  return (
    <TopBanner
      className="bg-background border-primary-800"
      showClose={false}
      icon={
        <Image src="/assets/info-fill.svg" width={24} height={24} alt="info" />
      }
      render={
        <p className="text-sm font-bold">
          يجب أن تحصل على أكثر من{" "}
          <span className="underline mx-1 text-primary-800"> %{score} </span> في
          هذا الامتحان
        </p>
      }
    />
  );
});

export const ResultBanner = memo(({ score }: { score: number }) => {
  return (
    <TopBanner
      className="bg-background border-primary-800"
      showClose={false}
      icon={
        <Image src="/assets/info-fill.svg" width={24} height={24} alt="info" />
      }
      render={
        <p className="flex  text-sm gap-2">
          <span className=" font-medium">لقد حصلت على </span>
          <span className="text-primary-800 font-bold inline-block">
            {score}%
          </span>
          <span className=" font-medium">فى هذا الامتحان</span>
        </p>
      }
    />
  );
});

export const ExamTimerBanner = memo(({ timer }: { timer: string }) => {
  return (
    <TopBanner
      className="bg-background border-primary-800"
      showClose={false}
      icon={
        <Image src="/assets/time-fill.svg" width={24} height={24} alt="time" />
      }
      render={
        <p className="flex  text-sm gap-1 font-bold">
          <span>وقت الامتحان</span>
          <span className="text-primary-800 underline  inline-block">
            {timer} دقيقة
          </span>
        </p>
      }
    />
  );
});
