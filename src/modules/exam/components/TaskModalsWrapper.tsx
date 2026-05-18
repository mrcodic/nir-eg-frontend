"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import { ExamType } from "@/components/forms/ExamForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const AssignmentModal = dynamic(
  () => import("@/components/modals/AssignmentModal"),
);
const SureModal = dynamic(() => import("@/components/modals/SureModal"));
const PassedModal = dynamic(() => import("@/components/modals/passedModal"));
const FailModal = dynamic(() => import("@/components/modals/FailModal"));

type Props = {
  sure: boolean;
  success: boolean;
  fail: boolean;
  handleClose: (confirmed?: boolean) => void;
  start: any;
  showAnswersHandler: () => void;
  retakeHandler: () => Promise<void>;
  examId: number;
  isLoadingRetake: boolean;
  examType?: ExamType;
  isAssignment?: boolean;
};

export default function TaskModalsWrapper({
  sure,
  success,
  fail,
  handleClose,
  start,
  showAnswersHandler,
  retakeHandler,
  examId,
  isLoadingRetake,
  examType = "exam",
  isAssignment,
}: Props) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <LoadingSpinner />
        </div>
      }
    >
      {sure && (
        <SureModal
          open={sure}
          setOpen={handleClose}
          questionsCount={start?.questions_count}
        />
      )}

      {success && !isAssignment && (
        <PassedModal
          open={success}
          showAnswers={showAnswersHandler}
          retake={retakeHandler}
          start={start}
          taskId={examId.toString()}
          isLoadingRetake={isLoadingRetake}
          examType={examType}
        />
      )}

      {success && isAssignment && (
        <AssignmentModal
          open={success}
          showAnswers={showAnswersHandler}
          retake={retakeHandler}
          start={start}
          taskId={examId.toString()}
          isLoadingRetake={isLoadingRetake}
        />
      )}

      {fail && (
        <FailModal
          open={fail}
          showAnswers={showAnswersHandler}
          retake={retakeHandler}
          start={start}
          taskId={examId.toString()}
          isLoadingRetake={isLoadingRetake}
          examType={examType}
        />
      )}
    </Suspense>
  );
}
