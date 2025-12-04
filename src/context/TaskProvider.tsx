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
  useState,
} from "react";
import { useForm } from "react-hook-form";

interface TaskContextType {
  form: any;
  start: QuizStatus;
  isLoading: boolean;
  data: any;
  setData: (data: any) => void;
  showRoom: boolean;
  setShowRoom: (showRoom: boolean) => void;
  startExam: boolean;
  setStartExam: (startExam: boolean) => void;
  completed: boolean;
  setCompleted: (completed: boolean) => void;
  onComplete: (data: { completed: boolean }) => void;
  taskType: string;
  taskId: string;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskContextProvider");
  }
  return context;
};

export const TaskProvider = ({ children, taskType = "exam" }) => {
  // Get the appropriate ID based on task type
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

  // Shared state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState();
  const [showRoom, setShowRoom] = useState(false);
  const [startExam, setStartExam] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Fetch task data
  const {
    data: start,
    isLoading,
    error,
  } = useQuery<QuizStatus>({
    queryKey: [`/students/quiz/start/${taskId}`],
    queryFn: async () => {
      const res = await getClientPrivateData({
        queryKey: [`/students/quiz/start/${taskId}`],
      });
      return res.body;
    },
    enabled: !!taskId,
  });

  // Handle completion callback
  const onComplete = useCallback(
    ({ completed: isCompleted }) => {
      if (isCompleted) {
        setCompleted(true);
      }
    },
    [setCompleted]
  );

  useEffect(() => {
    document.documentElement.scroll({ top: 0 });
  }, []);

  const value = {
    form,
    // Data
    start,
    isLoading,
    data,
    setData,

    // UI state
    showRoom,
    setShowRoom,
    startExam,
    setStartExam,
    completed,
    setCompleted,

    // Callbacks
    onComplete,

    // Task info
    taskType,
    taskId,

    isSubmitting,
    setIsSubmitting,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
