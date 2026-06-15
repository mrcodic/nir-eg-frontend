import { ApiResponse, QuizQuestion } from "@/types";

export type TaskQuestionPayload = {
  questions?: QuizQuestion[];
  score?: string;
  timer?: string;
  is_subscribed: boolean;
  questionsCount: number;
};

export type TaskAnswerOption = {
  id: number;
  valueInput: string | null;
  valueCk: string | null;
  correct: boolean;
  selected: boolean;
};

export type TaskEssayAttachment = {
  media_id: number;
  url: string;
  name: string;
  mime: string;
};

export type TaskEssayAnswer = {
  text: string | null;
  attachments: TaskEssayAttachment[];
  graded: number | boolean;
  is_correct: number | boolean;
};

export type TaskChoiceAnswerQuestion = {
  id: number;
  title: string | null;
  type: 1;
  score: number;
  answer_video: string | null;
  explanation: string | null;
  has_multi_correct: boolean;
  answers: TaskAnswerOption[];
  essay: null;
};

export type TaskParagraphAnswerQuestion = {
  id: number;
  title: string | null;
  type: 2;
  score: number;
  answer_video: string | null;
  explanation: string | null;
  has_multi_correct: boolean | null;
  essay: null;
  related_questions: TaskChoiceAnswerQuestion[];
};

export type TaskEssayQuestion = {
  id: number;
  title: string | null;
  type: 3;
  score: number;
  answer_video: string | null;
  explanation: string | null;
  has_multi_correct: boolean | null;
  essay: TaskEssayAnswer | null;
};

export type TaskShowAnswersQuestion =
  | TaskChoiceAnswerQuestion
  | TaskParagraphAnswerQuestion
  | TaskEssayQuestion;

export type TaskShowAnswersDetails = {
  title: string;
  result: boolean;
  score: number;
  total_score: number;
  total_score_denominator: number;
  score_ratio: string;
  score_text_ar: string;
  review_pending: boolean;
};

export type TaskShowAnswersBody = {
  details: TaskShowAnswersDetails;
  essay_status_map: Record<string, number>;
  essay_correct_map: Record<string, number>;
  multi_correct_map: Record<string, boolean>;
  questions: TaskShowAnswersQuestion[];
};

export type TaskShowAnswersData = TaskShowAnswersBody & {
  solution?: boolean;
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

export type TaskShowAnswersResponse = ApiResponse<TaskShowAnswersBody>;
