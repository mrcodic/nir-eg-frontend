"use client";

import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { TaskAnswerResponse, TaskQuestionsResponse } from "@/types/quiz.types";

export async function getTaskQuestions(quizId: string | number) {
  return getClientPrivateData<TaskQuestionsResponse>({
    queryKey: [`/students/quiz/questions/${quizId}`],
  });
}

export async function submitTaskAnswer(payload: FormData) {
  return mutateClient<TaskAnswerResponse>("/students/quiz/answer", {
    body: payload,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
