"use client";

import { Button } from "@/components/ui/button";
import { formatApiDate } from "@/helpers/format-api-date";
import { IExamCard } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudentScoreResult from "./StudentScoreResult";

type Props = {
  exam: IExamCard;
  isPreviousExam?: boolean;
};

const ExamCard = ({ exam }: Props) => {
  const { classroomId } = useParams();

  const isPendingReview = exam.review_pending;
  const isExpired = new Date(exam.expires_at) < new Date();
  const isCompleted = exam.completed && exam.score_ratio;

  let ctaLabel: string | null = null;
  let ctaHref: string | null = null;

  if (isPendingReview) {
    ctaLabel = "جاري التصحيح";
  } else if (isExpired && isCompleted && exam.show_answer) {
    ctaLabel = "عرض الاجابات";
    ctaHref = `/bundles/${classroomId}/general-exams/${exam.id}`;
  } else if (isExpired && !isCompleted) {
    ctaLabel = "لم تقم بحل الامتحان";
  } else if (!isExpired && (!isCompleted || exam.retake)) {
    ctaLabel = isCompleted ? "اعادة الامتحان" : "الذهاب للامتحان";
    ctaHref = `/bundles/${classroomId}/general-exams/${exam.id}`;
  } else if (isCompleted && !exam.retake) {
    ctaLabel = "قمت بحل الامتحان";
  }

  return (
    <div className="border-gray-light relative flex flex-wrap gap-2.5 gap-y-4 rounded-xl border p-4 shadow-sm">
      <div className="grow">
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-4">
          <div className="flex gap-6">
            <Image
              width={32}
              height={32}
              className="size-8 self-start"
              src="/assets/icons/exam-fill.svg"
              alt="exam icon"
            />
            <h3 className="text-lg font-bold text-black">{exam.title}</h3>
          </div>

          <div className="ms-auto flex w-fit flex-wrap items-end gap-2 empty:hidden">
            {ctaLabel &&
              (ctaHref ? (
                <Link href={ctaHref}>
                  <Button className="h-8">
                    <span>{ctaLabel}</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex h-8 shrink-0 items-center gap-2 rounded-lg border border-black px-3 text-sm font-bold text-black">
                  {ctaLabel}
                </div>
              ))}

            {exam.score_ratio && (
              <StudentScoreResult score={exam.score} pass={exam.passed} />
            )}
          </div>
        </div>

        <div className="border-gray-light mt-4 grid grid-cols-1 items-center justify-between gap-1 border-t pt-2 empty:hidden sm:grid-cols-2">
          {exam.duration && (
            <div className="flex gap-2">
              <Image
                width={24}
                height={24}
                className="h-6 w-6"
                src="/assets/time.svg"
                alt="time"
              />
              <span className="text-sm font-medium">
                مدة الامتحان:
                <strong className="ms-1">{exam.duration} دقيقة</strong>
              </span>
            </div>
          )}

          {exam.created_at && (
            <div className="flex gap-2">
              <Image
                width={24}
                height={24}
                className="h-6 w-6"
                src="/assets/calendar.svg"
                alt="calendar"
              />
              <span className="text-sm font-medium">
                تاريخ الامتحان:
                <strong className="ms-1">
                  {formatApiDate(exam.created_at, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    fallback: "",
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
