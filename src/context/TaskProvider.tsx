"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { quizSchema } from "@/lib/schemas";
import { QuizStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Control,
  FormProvider,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  useForm,
} from "react-hook-form";

interface TaskContextType {
  // ✅ RHF (stable only)
  control: Control<any>;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<{
    quiz_id: string;
    questions: {};
  }>;

  // data
  start: QuizStatus;
  isLoading: boolean;
  data: any;
  setData: (data: any) => void;

  // UI state
  showRoom: boolean;
  setShowRoom: (v: boolean) => void;
  startExam: boolean;
  setStartExam: (v: boolean) => void;
  completed: boolean;
  setCompleted: (v: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;

  // callbacks
  onComplete: (data: { completed: boolean }) => void;

  // task info
  taskType: string;
  taskId: string;
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

  const { control, getValues, setValue, trigger } = form;

  // ===== shared state =====
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState();
  const [showRoom, setShowRoom] = useState(false);
  const [startExam, setStartExam] = useState(false);
  const [completed, setCompleted] = useState(false);

  // ===== fetch start =====
  const { data: start, isLoading } = useQuery<QuizStatus>({
    queryKey: [`/students/quiz/start/${taskId}`],
    queryFn: async () => {
      const res = await getClientPrivateData({
        queryKey: [`/students/quiz/start/${taskId}`],
      });
      return res.body;
    },
    enabled: !!taskId,
  });

  const onComplete = useCallback(({ completed }: { completed: boolean }) => {
    if (completed) setCompleted(true);
  }, []);

  useEffect(() => {
    document.documentElement.scroll({ top: 0 });
  }, []);

  // ✅ memoized context value (NO form)
  const value = useMemo<TaskContextType>(
    () => ({
      control,
      getValues,
      setValue,
      trigger,

      start,
      isLoading,
      data,
      setData,

      showRoom,
      setShowRoom,
      startExam,
      setStartExam,
      completed,
      setCompleted,
      isSubmitting,
      setIsSubmitting,

      onComplete,

      taskType,
      taskId,
    }),
    [
      control,
      getValues,
      setValue,
      trigger,
      start,
      isLoading,
      data,
      showRoom,
      startExam,
      completed,
      isSubmitting,
      onComplete,
      taskType,
      taskId,
    ],
  );

  console.log(start);

  return (
    <TaskContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </TaskContext.Provider>
  );
};
