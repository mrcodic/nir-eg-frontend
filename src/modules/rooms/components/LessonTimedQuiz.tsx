"use client";

import SmallSpinner from "@/components/custom/SmallSpinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ILesson } from "@/types";
import { useLessonTimedQuiz } from "../hooks/useLessonTimedQuiz";
import LessonTimedQuizConfirmModal from "./LessonTimedQuizConfirmModal";
import LessonTimedQuizQuestionView from "./LessonTimedQuizQuestionView";
import LessonTimedQuizResultView from "./LessonTimedQuizResultView";

export default function LessonTimedQuiz({
  lessonData,
}: {
  lessonData: ILesson;
}) {
  const quiz = useLessonTimedQuiz(lessonData);

  if (!quiz.open && !quiz.showResult) return null;

  return (
    <>
      <Dialog
        open={quiz.open}
        onOpenChange={(next) => {
          if (quiz.isSubmitting) return;
          if (!next) quiz.handleManualClose();
          quiz.setOpen(next);
        }}
      >
        <DialogContent
          className={cn("z-[1000002] max-w-lg transition-all", {
            "blur-sm brightness-50": quiz.confirmOpen,
          })}
          overlayClassName="z-[1000002]"
          hideClose={quiz.showResult}
        >
          {quiz.isLoading ? (
            <div className="flex min-h-44 items-center justify-center">
              <SmallSpinner className="text-primary-800" />
            </div>
          ) : quiz.showResult ? (
            <LessonTimedQuizResultView
              passed={quiz.passed}
              score={quiz.score}
              onContinue={quiz.closeAll}
            />
          ) : quiz.currentQuestion ? (
            <LessonTimedQuizQuestionView quiz={quiz} />
          ) : (
            <div className="flex min-h-44 items-center justify-center">
              <Button
                variant="ghost"
                className="text-gray-dark"
                onClick={quiz.handleManualClose}
              >
                إغلاق
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {quiz.confirmOpen && (
        <LessonTimedQuizConfirmModal
          open={quiz.confirmOpen}
          unansweredCount={quiz.unansweredCount}
          mode={quiz.pendingAction}
          onCancel={() => quiz.setConfirmOpen(false)}
          onConfirm={quiz.handleConfirmSubmit}
        />
      )}
    </>
  );
}
