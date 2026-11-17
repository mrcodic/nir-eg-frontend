export const CENTER_STUDENT_TYPE = 3;

export const CENTER_ATTENDANCE_STATUS = { absent: 0, present: 1 } as const;
export const CENTER_HOMEWORK_STATUS = { completed: 1, unsolved: 2 } as const;

export type CenterProgressRoom = {
  room_id: number;
  number: number;
  title: string;
  attendance_status: number | null;
  attendance_label: string;
  homework_status: number | null;
  homework_label: string;
  quiz_score: number | null;
  quiz_total: number | null;
  quiz_mark: string | null;
  quiz_percentage: number | null;
  notes: string | null;
  date: string | null;
};

export type CenterQuizProgress = {
  room_id: number;
  number: number;
  title: string;
  score: number;
  total_score: number;
  percentage: number;
};

export type CenterHomeworkProgress = {
  percentage: number;
  completed: number;
  incomplete: number;
  unsolved: number;
  total: number;
};

export type CenterProgressData = {
  classroom: { id: number; title: string };
  student: { id: number; name: string; code: string };
  stats: {
    total_rooms: number;
    present: number;
    absent: number;
    unrecorded: number;
    attendance_percentage: number;
    homework_done: number;
    homework_incomplete: number;
    homework_unsolved: number;
    homework_total: number;
    homework_percentage: number;
  };
  charts: {
    quiz_progress: CenterQuizProgress[];
    homework: CenterHomeworkProgress;
  };
  rooms: CenterProgressRoom[];
};

export type CenterProgressResponse = {
  status: boolean;
  data: CenterProgressData | null;
};
