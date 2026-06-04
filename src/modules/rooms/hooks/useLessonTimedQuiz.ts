"use client";

import { useToast } from "@/hooks/use-toast";
import { getTaskQuestions, submitTaskAnswer } from "@/services/task.service";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import { ILesson, QuizQuestion } from "@/types";
import { TaskAnswerResult } from "@/types/quiz.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

type TimedQuizFormValues = {
  quiz_id: string;
  skip?: number;
  questions: Record<string, string[]>;
};
type PendingAction = "submit" | "skip" | null;

const timedQuizSchema = z.object({
  quiz_id: z.string().min(1),
  skip: z.number().optional(),
  questions: z.record(z.array(z.string()).optional()),
});

const scoreFromResult = (result?: TaskAnswerResult): number => {
  if (!result) return 0;
  const ratio = result.score_ratio;
  if (typeof ratio === "string" && ratio.includes("%")) {
    const parsed = Number(ratio.replace("%", "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }
  const score = Number(result.score ?? 0);
  return Number.isFinite(score) ? score : 0;
};

export function useLessonTimedQuiz(lessonData: ILesson) {
  const { toast } = useToast();
  const params = useParams();
  const queryClient = useQueryClient();

  const { currentTime, isPlaying, pause } = useVideoPlayerStore();

  const form = useForm<TimedQuizFormValues>({
    resolver: zodResolver(timedQuizSchema),
    mode: "onSubmit",
    defaultValues: { quiz_id: "", skip: 0, questions: {} },
  });

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<TaskAnswerResult | null>(null);
  const [handledQuizIds, setHandledQuizIds] = useState<number[]>([]);
  const lastSeenSecondRef = useRef<number | null>(null);

  const formQuestions = useWatch({ control: form.control, name: "questions" });

  const classroomId = Number(params.classroomId);
  const roomId = Number(params.room);
  const currentSecond = Math.max(0, Math.floor(currentTime ?? 0));

  const availableQuizzes = useMemo(
    () =>
      (lessonData?.quizzes ?? [])
        .filter((quiz) => quiz.has_questions && !quiz.answered && !quiz.skipped)
        .sort((a, b) => a.time - b.time),
    [lessonData?.quizzes],
  );

  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const selectedAnswers = currentQuestion
    ? (formQuestions?.[String(currentQuestion.id)] ?? [])
    : [];
  const showResult = result !== null;
  const passed = Boolean(result?.result ?? result?.passed);
  const score = scoreFromResult(result ?? undefined);

  const questionProgress = useMemo(() => {
    const answeredQuestionIds = new Set<number>();
    let unanswered = 0;

    questions.forEach((question) => {
      const values = formQuestions?.[String(question.id)] ?? [];
      if (values.length > 0) {
        answeredQuestionIds.add(question.id);
      } else {
        unanswered += 1;
      }
    });

    return { answeredQuestionIds, unanswered };
  }, [formQuestions, questions]);

  const answeredQuestionIds = questionProgress.answeredQuestionIds;
  const unansweredCount = questionProgress.unanswered || 0;

  const closeAll = useCallback(() => {
    setOpen(false);
    setConfirmOpen(false);
    setPendingAction(null);
    setResult(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setActiveQuizId(null);
    form.reset({ quiz_id: "", skip: 0, questions: {} });
  }, [form]);

  const markHandled = useCallback((quizId: number) => {
    setHandledQuizIds((prev) =>
      prev.includes(quizId) ? prev : [...prev, quizId],
    );
  }, []);

  const handleManualClose = useCallback(() => {
    if (activeQuizId && !result) markHandled(activeQuizId);
    closeAll();
  }, [activeQuizId, closeAll, markHandled, result]);

  const loadQuizQuestions = useCallback(
    async (quizId: number) => {
      setIsLoading(true);
      try {
        const response = await getTaskQuestions(quizId);
        const quizQuestions =
          response?.body?.questions ?? response?.data?.questions ?? [];
        const mcqOnly = quizQuestions.filter(
          (q) => q.type !== 2 && q.type !== 3,
        );

        if (!mcqOnly.length) {
          toast({
            icon: "error",
            description: "لا توجد أسئلة اختيار متاحة لهذا الاختبار.",
          });
          markHandled(quizId);
          closeAll();
          return;
        }

        setQuestions(mcqOnly);
        setCurrentQuestionIndex(0);
        setActiveQuizId(quizId);
        setResult(null);
        form.reset({ quiz_id: String(quizId), skip: 0, questions: {} });
        setOpen(true);
      } catch {
        toast({ icon: "error", description: "تعذر تحميل أسئلة الاختبار." });
        closeAll();
      } finally {
        setIsLoading(false);
      }
    },
    [closeAll, form, markHandled, toast],
  );

  const submitPayload = useCallback(
    async (skip: boolean) => {
      if (!activeQuizId) return;

      const values = form.getValues();
      const formData = new FormData();
      formData.append("quiz_id", String(activeQuizId));
      formData.append("classroom_id", String(classroomId));

      if (skip) {
        formData.append("skip", "1");
      } else {
        questions.forEach((question) => {
          const selected = values.questions?.[String(question.id)] ?? [];
          if (!selected.length) {
            formData.append(`questions[${question.id}]`, "");
            return;
          }
          selected.forEach((answerId, index) => {
            formData.append(`questions[${question.id}][${index}]`, answerId);
          });
        });
      }

      setIsSubmitting(true);
      try {
        const response = await submitTaskAnswer(formData);
        const resultPayload = response?.body ?? response?.data ?? null;

        markHandled(activeQuizId);
        await queryClient.invalidateQueries({
          queryKey: [
            `/students/get-lessons/${roomId}?classroom_id=${classroomId}`,
          ],
        });

        if (skip) {
          closeAll();
          return;
        }

        setResult(resultPayload);
      } catch {
        toast({
          icon: "error",
          description: "تعذر إرسال إجابتك، حاول مرة أخرى.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      activeQuizId,
      classroomId,
      closeAll,
      form,
      markHandled,
      queryClient,
      questions,
      roomId,
      toast,
    ],
  );

  useEffect(() => {
    setHandledQuizIds([]);
    lastSeenSecondRef.current = null;
    closeAll();
  }, [closeAll, lessonData.id]);

  useEffect(() => {
    if (open || isLoading || isSubmitting) return;
    if (!isPlaying) return;
    if (currentSecond < 0) return;

    const previousSecond = lastSeenSecondRef.current;
    lastSeenSecondRef.current = currentSecond;

    // Bootstrap sample: wait for the next tick to compute a real crossing.
    if (previousSecond === null) return;

    // Startup resume jump guard (e.g. 0s -> 300s from remembered position):
    // don't retro-trigger timed quizzes that were in the skipped range.
    if (currentSecond - previousSecond > 10) return;

    const dueQuiz = availableQuizzes.find((quiz) => {
      if (handledQuizIds.includes(quiz.id)) return false;
      // if quiz time is 0 , then show it from 1st second
      const triggerSecond = quiz.time === 0 ? 1 : quiz.time * 60;
      // if quiz time is 1 , then show it from minute one till 1:59
      const triggerCap = (quiz.time + 1) * 60 - 1;

      return currentSecond <= triggerCap && currentSecond >= triggerSecond;
    });
    if (!dueQuiz) return;
    pause?.();
    loadQuizQuestions(dueQuiz.id);
  }, [
    availableQuizzes,
    currentSecond,
    handledQuizIds,
    isLoading,
    isSubmitting,
    isPlaying,
    loadQuizQuestions,
    open,
    pause,
  ]);

  const toggleAnswer = useCallback(
    (questionId: number, answerId: string) => {
      const fieldName = `questions.${questionId}` as const;
      form.setValue(fieldName, [answerId], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [form],
  );

  const handleConfirm = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    setPendingAction("submit");
    setConfirmOpen(true);
  }, [form]);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSkip = useCallback(() => {
    setPendingAction("skip");
    setConfirmOpen(true);
  }, []);

  const handleConfirmSubmit = useCallback(async () => {
    setConfirmOpen(false);
    if (pendingAction === "skip") {
      await submitPayload(true);
      setPendingAction(null);
      return;
    }
    await submitPayload(false);
    setPendingAction(null);
  }, [pendingAction, submitPayload]);

  return {
    form,
    open,
    setOpen,
    confirmOpen,
    setConfirmOpen,
    pendingAction,
    isLoading,
    isSubmitting,
    questions,
    currentQuestion,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedAnswers,
    showResult,
    passed,
    score,
    unansweredCount,
    answeredQuestionIds,
    handleManualClose,
    toggleAnswer,
    handleConfirm,
    goToNextQuestion,
    goToPreviousQuestion,
    handleSkip,
    handleConfirmSubmit,
    closeAll,
  };
}
