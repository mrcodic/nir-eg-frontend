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
        <p className="text-sm">
          يجب أن تحصل على أكثر من{" "}
          <span className="text-primary-800 mx-1 underline"> %{score} </span> في
          هذا الامتحان
        </p>
      }
    />
  );
});

TargetGradeBanner.displayName = "TargetGradeBanner";

export const ResultBanner = memo(({ score }: { score: number }) => {
  return (
    <TopBanner
      className="bg-background border-primary-800"
      showClose={false}
      icon={
        <Image src="/assets/info-fill.svg" width={24} height={24} alt="info" />
      }
      render={
        <p className="flex gap-2 text-sm">
          <span className="font-medium">لقد حصلت على </span>
          <span className="text-primary-800 inline-block font-bold">
            {score}%
          </span>
          <span className="font-medium">فى هذا الامتحان</span>
        </p>
      }
    />
  );
});

ResultBanner.displayName = "ResultBanner";

export const ExamTimerBanner = memo(({ timer }: { timer: string }) => {
  return (
    <TopBanner
      className="bg-background border-primary-800"
      showClose={false}
      icon={
        <Image src="/assets/time-fill.svg" width={24} height={24} alt="time" />
      }
      render={
        <p className="flex gap-1 text-sm font-bold">
          <span>وقت الامتحان</span>
          <span className="text-primary-800 inline-block underline">
            {timer} دقيقة
          </span>
        </p>
      }
    />
  );
});

ExamTimerBanner.displayName = "ExamTimerBanner";
