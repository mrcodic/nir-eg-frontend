import StackedBanners, { StackedBannerItem } from "./StackedBanners";
import { IOtpViewStatus } from "@/hooks/useLessonRoomLogic";
import React from "react";

export default function VideoBanners({
  requiresOtpVideo,
  viewCount,
  lockedToPass,
  lockedByViewLimit,
}: {
  requiresOtpVideo: boolean;
  viewCount: IOtpViewStatus;
  lockedToPass: boolean;
  lockedByViewLimit: boolean;
}) {
  const banners: StackedBannerItem[] = [];

  if (requiresOtpVideo && viewCount) {
    banners.push({
      id: "otp",
      className: "border-secondary bg-white text-black  p-1",
      content: (
        <p className="text-xs sm:text-xs">
          عدد المشاهدات المسموح هو <strong>{viewCount.total_views}</strong>،
          متبقي لك <strong>{viewCount.remaining}</strong> مشاهدة ويتم احتساب
          المشاهدة بعد اول 15 دقيقة في الفيديو.
        </p>
      ),
    });
  }

  if (lockedToPass || !!lockedByViewLimit) {
    banners.push({
      id: "locked",
      className: "border-secondary bg-white text-black  p-1",
      wrapperClassName: "gap-2",
      icon: "/assets/warning-fill.svg",
      iconSize: 24,
      imgClassName: "w-6 h-6",

      content: (
        <p className="text-xs sm:text-xs">
          {!!lockedByViewLimit
            ? "لقد تجاوزت الحد الأقصى لعدد المشاهدات المسموح بها لهذا الدرس"
            : "يجب ان تقوم باجتياز الاختبار أولا"}
        </p>
      ),
    });
  }

  if (!banners.length) return null;

  return (
    <StackedBanners
      banners={banners}
      containerClassName="absolute top-0 left-2 right-2 "
    />
  );
}
