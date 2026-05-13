"use client";

import { cn } from "@/lib/utils";
import { IExamCard } from "@/types";
import { getRemainingTimeArabic } from "@/utils/clientFun";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const parseApiDate = (value?: string) => {
  if (!value) return null;

  // "2026 Jan 22"
  if (/^\d{4}\s[A-Za-z]{3}\s\d{2}$/.test(value)) {
    const d = new Date(`${value} 00:00:00 UTC`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // "2026-01-25 09:42:40"
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(value)) {
    const d = new Date(value.replace(" ", "T") + "Z");
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // ISO or fallback
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatArabicDate = (value?: string) => {
  const date = parseApiDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

type Props = {
  exam: IExamCard;
  isPreviousExam?: boolean;
};

const ExamStatusBadge = ({ expiresAt }: { expiresAt: string }) => {
  const isExpired = new Date(expiresAt) < new Date();

  return (
    <div className="absolute top-2 left-2 rounded-lg border-gray-100">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-1",
          isExpired ? "bg-[#B75050]" : "bg-[#D9B45C]",
        )}
      >
        <span className="text-[12px] font-bold text-white">
          {isExpired ? "انتهى الامتحان" : getRemainingTimeArabic(expiresAt)}
        </span>
      </div>
    </div>
  );
};

const ExamCard = ({ exam }: Props) => {
  const { SingleCourse } = useParams();

  // const isPendingReview = exam.completed && !exam.score_ratio;
  const isPendingReview = exam.review_pending;
  const isExpired = new Date(exam.expires_at) < new Date();
  const isCompleted = exam.completed && exam?.score_ratio;

  let ctaLabel: string | null = null;
  let ctaHref: string | null = null;

  if (isPendingReview) {
    ctaLabel = "جاري التصحيح";
  } else if (isExpired && isCompleted && exam.show_answer) {
    ctaLabel = "عرض الاجابات";
    ctaHref = `/bundles/${SingleCourse}/general-exams/${exam.id}`;
  } else if (isExpired && !isCompleted) {
    ctaLabel = "لم تقم بحل الامتحان";
  } else if (!isExpired && (!isCompleted || exam.retake)) {
    ctaLabel = isCompleted ? "اعادة الامتحان" : "الذهاب للامتحان";
    ctaHref = `/bundles/${SingleCourse}/general-exams/${exam.id}`;
  } else if (isCompleted && !exam?.retake) {
    ctaLabel = "قمت بحل الامتحان";
  }

  return (
    <div className="border-primary-800 relative flex flex-wrap gap-2.5 gap-y-4 rounded-xl border p-2">
      <ExamStatusBadge expiresAt={exam.expires_at} />

      <div className="flex grow items-start gap-2.5">
        <img
          className="size-14 self-start sm:size-[72px]"
          src="/assets/ExamsColor.svg"
          alt="exam icon"
        />

        <div className="grow max-sm:pt-8">
          <div className="sm:pl-6">
            <h3 className="text-[18px] font-bold text-black sm:pe-28">
              {exam.title}
            </h3>
            <div className="bg-secondary my-4 h-px" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1">
            {exam.duration && (
              <div className="flex gap-2">
                <img className="h-6 w-6" src="/assets/time.svg" alt="time" />
                <span className="text-sm font-medium">
                  مدة الامتحان:
                  <strong className="ms-1">{exam.duration} دقيقة</strong>
                </span>
              </div>
            )}

            {exam.created_at && (
              <div className="flex gap-2">
                <img
                  className="h-6 w-6"
                  src="/assets/calendar.svg"
                  alt="calendar"
                />
                <span className="text-[14px] font-medium">
                  تاريخ الامتحان:
                  <strong className="ms-1">
                    {formatArabicDate(exam.created_at)}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-fit flex-wrap items-end gap-2">
        {ctaLabel &&
          (ctaHref ? (
            <Link
              href={ctaHref}
              className="bg-primary border-secondary flex h-11 shrink-0 items-center gap-2 rounded-lg border px-2 py-2 text-white"
            >
              <span>{ctaLabel}</span>
              <img
                src="/assets/LeftArrowColor.svg"
                className="size-5"
                alt="arrow"
              />
            </Link>
          ) : (
            <div className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-black px-3 font-bold text-black">
              {ctaLabel}
            </div>
          ))}

        {exam.score_ratio && (
          <div className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-black px-3 font-bold">
            <Image
              src={
                exam.passed ? "/assets/CorrectColor.svg" : "/assets/Close2.svg"
              }
              width={20}
              height={20}
              alt={exam.passed ? "ناجح" : "راسب"}
            />
            <span
              className={cn(exam.passed ? "text-[#1EAD7B]" : "text-[#B75050]")}
            >
              {exam.score_ratio} درجة
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamCard;
