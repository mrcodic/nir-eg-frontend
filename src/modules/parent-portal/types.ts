import { TaskType } from "@/types";

export type IPortalQuiz = {
  id: number;
  title: string;
  hasResult: boolean;
  max_mark: number | null;
  score: number | null;
  score_ratio: string | null;
  status: string | null;
  submitted_at: string | null;
  classroom?: string;
  type: TaskType;
  type_label: TaskType;
  passed: boolean;
};

type IPortalLesson = {
  id: number;
  title: string;
  isCompleted: boolean;
  duration: number;
};

type IPortalRoom = {
  id: number;
  title: string;
  progress: number;
  isCompleted: boolean;
  lessonsCount: number;
  lessonsDone: number;
  lessons: IPortalLesson[];
  quizzes: IPortalQuiz[];
};

export type IPortalClassroom = {
  id: number;
  title: string;
  progress: number;
  rooms: IPortalRoom[];
  counts: {
    total: number;
    passed: number;
    failed: number;
  };
};

export type IPortalSummaryData = {
  classrooms: IPortalClassroom[];
  student: {
    grade_id: number;
    grade_name: string;
    id: number;
    name: string;
    type: number;
    type_label: string;
    avatar: string;
  };
  attendance?: {
    total: number;
    attend: number;
    absent: number;
  };
};

export type IPortalMetaData = {
  expires_at: string;
  remaining: {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    human: string;
  };
};
