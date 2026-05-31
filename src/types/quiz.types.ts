import { QuizQuestion } from "@/types";

export type TaskQuestionPayload = {
  questions?: QuizQuestion[];
};

export type TaskQuestionsResponse = {
  status?: boolean;
  code?: number | string;
  message?: string;
  body?: TaskQuestionPayload;
  data?: TaskQuestionPayload;
};

export type TaskAnswerResult = {
  result?: boolean;
  passed?: boolean;
  score?: number | string;
  score_ratio?: string;
  review_pending?: boolean;
};

export type TaskAnswerResponse = {
  status?: boolean;
  code?: number | string;
  message?: string;
  body?: TaskAnswerResult;
  data?: TaskAnswerResult;
};
