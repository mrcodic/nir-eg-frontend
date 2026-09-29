"use client";

import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import CustomError from "@/lib/customError";
import { quizSchema } from "@/schemas/auth.schema";
import { QuizStatus } from "@/types";
import { TaskQuestionPayload, TaskShowAnswersData } from "@/types/quiz.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Control,
  FormProvider,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
  useForm,
} from "react-hook-form";
import { useTenant } from "./TenantProvider";

interface TaskContextType {
  // ✅ RHF (stable only)
  control: Control<any>;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<{
    quiz_id: string;
    questions: {};
  }>;
  reset: UseFormReset<{
    quiz_id: string;
    questions: {};
  }>;

  // data
  start: QuizStatus;
  isLoading: boolean;
  isFetching: boolean;
  data?: TaskQuestionPayload | TaskShowAnswersData;
  setData: (data?: TaskQuestionPayload | TaskShowAnswersData) => void;

  // UI state
  showRoom: boolean;
  setShowRoom: (v: boolean) => void;
  startExam: boolean;
  setStartExam: (v: boolean) => void;
  timerStart: string | null;
  setTimerStart: (value: string | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;

  // callbacks
  onComplete: () => Promise<void>;

  // task info
  taskType: string;
  taskId: string;

  isTaskClosed: boolean;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }
  return ctx;
};

export const TaskProvider = ({ children, taskType = "exam" }) => {
  const params = useParams();
  const { features } = useTenant();

  const taskId = (
    taskType === "exam" ? params.examId : params.assignmentId
  ) as string;

  const form = useForm({
    mode: "all",
    resolver: zodResolver(quizSchema),
    defaultValues: {
      quiz_id: taskId,
      questions: {},
    },
  });

  const { control, getValues, setValue, trigger, reset } = form;

  // ===== shared state =====
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<TaskQuestionPayload | TaskShowAnswersData>();
  const [showRoom, setShowRoom] = useState(false);
  const [startExam, setStartExam] = useState(false);
  const [timerStart, setTimerStart] = useState<string | null>(null);
  const isReconcilingExpiry = useRef(false);

  // ===== fetch start =====
  const {
    data: start,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<QuizStatus>({
    queryKey: [`/students/quiz/start`, taskId],
    queryFn: async () => {
      const res = await getClientPrivateData({
        queryKey: [`/students/quiz/start/${taskId}`],
      });

      // console.log("start query : ", res.body);
      return res?.body || null;
    },
    enabled: !!taskId && features?.quizzes,
    staleTime: 0,
    // refetchOnMount: false,
  });

  useEffect(() => {
    setTimerStart(start?.start_timer ?? null);
  }, [start?.start_timer, taskId]);

  const onComplete = useCallback(async () => {
    if (isReconcilingExpiry.current) return;

    isReconcilingExpiry.current = true;
    setStartExam(false);
    setIsSubmitting(true);

    try {
      await refetch();
    } finally {
      isReconcilingExpiry.current = false;
      setIsSubmitting(false);
    }
  }, [refetch]);

  useEffect(() => {
    document.documentElement.scroll({ top: 0 });
  }, []);

  const value = useMemo<TaskContextType>(
    () => ({
      control,
      getValues,
      setValue,
      trigger,

      start,
      isLoading,
      isFetching,
      data,
      setData,
      reset,

      showRoom,
      setShowRoom,
      startExam,
      setStartExam,
      timerStart,
      setTimerStart,
      isSubmitting,
      setIsSubmitting,

      onComplete,

      taskType,
      taskId,

      isTaskClosed: error instanceof CustomError && error?.status === 406,
    }),
    [
      control,
      getValues,
      setValue,
      trigger,
      start,
      isLoading,
      isFetching,
      data,
      showRoom,
      startExam,
      timerStart,
      isSubmitting,
      onComplete,
      taskType,
      taskId,
      error,
      reset,
    ],
  );

  if (features?.quizzes == false) {
    redirect("/profile");
  }

  return (
    <TaskContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </TaskContext.Provider>
  );
};
