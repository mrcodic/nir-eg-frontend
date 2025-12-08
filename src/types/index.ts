import { Control } from "react-hook-form";

export interface IUser {
  avatar: string;
  city: string;
  city_id: number;
  code_country: string;
  created_at: string;
  first_name: string;
  grade: number;
  grade_name: string;
  id: number;
  last_name: string;
  parent_phone: string;
  parent_phone_verification: boolean;
  phone: string;
  state_id: number;
  state_name: string;
  has_center?: boolean;
  center_id?: number;
  student_phone_verification: boolean;
  type: number;
  updated_at: string;
  points: number;
}

declare interface CustomInputProps {
  control: Control<any>;
  name: string;
  placeholder: string;
  className?: string;
  info?: string;
  type?: string;
  iconSrc?: string; // Icon support
}

export interface QuizStatus {
  is_subscribed: boolean;
  questions_count: number;
  result: boolean;
  retake: boolean;
  review_pending: boolean;
  score: number;
  score_ratio: string;
  score_text_ar: string;
  show_answer: boolean;
  timer: string;
  title: string;
  total_score: number;
  total_score_denominator: number;
}

export type QuizAnswer =
  | number
  | string
  | number[]
  | string[]
  | {
      type?: string;
      text?: string;
      attachments?: Attachment[];
      graded?: number | boolean;
      is_correct?: number | boolean;
      [key: string]: unknown;
    }
  | {
      id: number;
      valueCk?: string | null;
      correct?: boolean | "true" | "false" | string;
      status?: boolean | "true" | "false" | string;
      [key: string]: unknown;
    }
  | Record<string, unknown>;

export interface QuizQuestion {
  id: number;
  title?: string | null;
  type?: number;
  answers?: QuizAnswer[] | null;
  has_multi_correct?: boolean | null;
  related_questions?: QuizQuestion[] | null;
  [key: string]: unknown;
}

export interface QuizResult {
  id?: number;
  created_at?: string;
  final_mark?: number | string | null;
  num_retake?: number | null;
  points?: number | null;
  quiz_id?: number;
  student_id?: number;
  total_correct_answer?: string | number;
  total_score?: number | string;
  updated_at?: string;
  retake?: number | boolean;
  room_id?: number;
  score?: number | string;
  show_answer?: number | boolean;
  timer?: string | number;
  title?: string;
  type?: number;
  user_id?: number;
  answers?: Record<string, QuizAnswer>;
  [key: string]: unknown;
}

export interface QuizObject {
  id: number;
  title?: string | null;
  type?: number;
  completed?: boolean;
  locked?: boolean;
  missed?: boolean;
  must_pass?: boolean;
  question_count?: number;
  questions?: QuizQuestion[];
  related_questions?: QuizQuestion[] | null;
  retake?: boolean;
  score?: number | string;
  show_answer?: boolean;
  [key: string]: unknown;
}

export interface QuizItem {
  id: number;
  quiz_id?: number;
  title?: string;
  type?: number;
  created_at?: string;
  updated_at?: string;
  lock_after?: string | null;
  price?: string | null;
  question_bank_id?: string | number | null;
  randomize_answer?: number | boolean;
  randomize_question?: number | boolean;
  add_to_instructor_calendar?: number | boolean;
  add_to_student_calendar?: number | boolean;
  classroom_id?: number | null;
  force_show_answer?: number | boolean;
  grade?: number | null;
  result?: QuizResult | null;
  showed?: number | boolean;
  student_id?: number | null;
  total_correct_answer?: string | number | null;
  total_score?: number | string | null;
  updated?: string;
  retake?: number | boolean;
  room_id?: number;
  score?: number | string | null;
  show_answer?: number | boolean;
  timer?: string | number | null;
  user_id?: number | null;
  [key: string]: unknown;
}

export enum paymentType {
  wallet = "WALLET",
  visa = "CARD",
  aman = "KIOSK",
  fawerypay = "KIOSK",
  code = "code",
}

export enum paymentStatus {
  paid = "PAID",
  pending = "PENDING",
  failed = "FAILED",
  unpaid = "UNPAID",
}

interface CommentUser {
  id: number;
  name: string;
  avatar?: string;
  type?: string;
}

interface File {
  name: string;
  url: string;
}

export interface Reply {
  id: number;
  reply_id: number;
  body: string | null;
  created_at: string;
  at_second: number | null;
  documents: File[];
  images: File[];
  recordings: File[];
  user: CommentUser;
}

export interface Comment {
  id: number;
  lesson_id: number;
  at_second: number;
  at_minute: string;
  body: string | null;
  classroom_title: string;
  lesson_title: string;
  created_at: string;
  documents: File[];
  images: File[];
  recordings: File[];
  replies: Reply[];
  user: CommentUser;
}

export interface CommentsData {
  avatar: string;
  data: Comment[];
}

export interface INotification {
  id: string;
  classroom_id?: number;
  room_id?: number;
  quiz_id?: number;
  quiz_kind?: number;
  quiz_kind_label?: string;
  quiz_title?: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  payload?: {
    at_second: number;
    comment_excerpt: string;
    comment_id: number;
    lesson_id: number;
    lesson_title: string;
    replier_name: string;
    reply_excerpt: string;
    message: string;
    phone_msg: string;
    reply_id: number;
    page: number;
    page_lesson: number;
    page_per_comments: number;
    per_page_lesson: number;
  };
  type: "comment_replied" | "quiz_graded";
}

export interface IPagination<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
  };
  links: {
    first: string;
    last: string;
    next: string;
    prev: string;
  };
}

export interface NotificationsData extends IPagination<INotification> {}

export interface Grade {
  id: number;
  title: string;
}

export interface TopStudent {
  attempts: number;
  first_name: string;
  last_activity: string;
  last_name: string;
  profile_image: string;
  student_id: number;
  total_correct: number;
}

export type StudentActivity = {
  title: string;
  type: string;

  classroom: string;
  classroom_id: number;
  classroom_active: boolean;
  classroom_expired: boolean;
  classroom_expires_at: string | null;
  created_at: string;
  score: number | null;
  passed: boolean | null;
  score_ratio?: string | null;
  room_id: number;
  quiz_id: number;
};

export interface StudentActivitiesData {
  classroom_active: boolean;
  classroom_expired: boolean;
  expires_at: string;
  pagination: InnerPagination;
  remaining_days: number;
  students: StudentActivity[];
}

export interface Sale {
  id: number;
  name: string;
  discount_type: number;
  discount_value: number;
  duration: number;
}

// export interface IRoom {
//   id?: number;
//   title?: string;
//   description?: string | null;
//   created_at?: string;
//   price?: string | null;
//   assignments?: Assignment[] | null;
//   attachments?: Attachment[] | null;
//   lessons?: Lesson[] | null;
//   quizzes?: QuizItem[] | null;
//   lock_after?: string | null;
//   locked_to_pass?: boolean;
//   [key: string]: unknown;
// }

export interface LatestRoom {
  classroom?: string;
  id: number;
  is_subscriped?: boolean;
  latest_room?: RoomData | null;
  parent_phone_verification?: boolean;
  student_phone_verification?: boolean;
  [key: string]: unknown;
}

export interface Bundle {
  id: number;
  name: string;
  cover: string;
  price: string;
  classrooms: CourseType[];
  grade: Grade;
  sale: Sale | null;
  created_at: string;
  updated_at: string | null;
}

export interface CourseType {
  id: number;
  title: string;
  description: string;
  price: string;
  sale: Sale | null;
  subscription_status: boolean;
  thumbnail: string;
  type: string;
  subscription_type?: string;
  grade: Grade;
  top_3: TopStudent[];
  has_promocode?: boolean;
  discountPrice?: string;
  created_at: string;
  updated_at: string;
}

interface Assignment {
  completed: boolean;
  id: number;
  retake: boolean;
  score: number | null;
  show_answer: boolean;
  title: string;
}

interface Lesson {
  id: number;
  active: boolean;
  completed: boolean;
  description: string;
  duration: string;
  lesson_order: number;
  title: string;
  vedio_id: string;
}

export interface Attachment {
  name: string;
  url: string;
}

export interface RoomData {
  id: number;
  room_key?: string;
  title?: string;
  created_at: string;
  description: string;
  duration: string;

  assignments: Assignment[];
  attachments: Attachment[];
  lessons: Lesson[];
  quizzes: (QuizItem | QuizObject)[];

  grade?: Grade;

  exam_count: number;
  exams_count?: number;
  lessons_count?: number;
  material_count?: number;
  progress?: number;
  completed: boolean;

  price?: string;

  live_sessions?: boolean;
  locked_to_pass: boolean;
  lock_after?: number | null;

  is_subscriped: boolean;
  parent_phone_verification: boolean;
  student_phone_verification: boolean;

  type: number;

  [key: string]: unknown;
}

export interface IRoomDetails {
  assignments: Assignment[];
  is_subscriped: boolean;
  lessons: Lesson[];
  locked_to_pass: boolean;
  parent_phone_verification: boolean;
  quizzes: QuizItem[];
  room: RoomData;
  student_phone_verification: boolean;
  subscription_type: string;
}

export interface InnerPagination {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface ICourseDetails {
  classroom: string;
  classroom_duration: number;
  classroom_exams: any[];
  classroom_price: string;

  completed: boolean;
  completed_rooms_count: number;

  grade_id: number;
  grade_name: string;

  has_promocode: boolean;
  is_subscriped: boolean;

  last_updated: string;

  pagination: InnerPagination;

  parent_phone_verification: boolean;

  progress: number;

  rooms: RoomData[];

  subscription_type: string;

  totalMaterialCount: number;
  total_assignm_count: number;
  total_lessons_count: number;
  total_quizzes_count: number;
  total_rooms_count: number;
}

export type Coupon = {
  code: string;
  description: string;
  end_date: string;
  icon_url: string;
  id: number;
  price: number;
  // 1 = percentage , 0 = fixed
  type_discount: 1 | 0;
  show_promo: boolean;
};

export type BookItem = {
  book_id: number;
  book_image: string;
  book_name: string;
  book_price: number;
  id: number;
  quantity: number;
  unit_price: number;
};

export interface CourseOrder {
  amount: number;
  created_at: string;
  expiration_time: string;
  id: number;
  kiosk_reference: string | null;
  model: {
    cover: string;
    description: string;
    id: number;
    name: string | null;
    model_type?: string;
    courses?: string[];
  };
  payment_method: string;
  payment_status: paymentStatus;
  trasnsaction_id: string;
  model_type?: string;
}

export type BooksOrder = {
  type: "book" | "cart";
  items: BookItem[];
  order_number: string;
  created_at: string;
  status: paymentStatus;
  delivery_status: number;
  total_price: number;
};

export interface ApiResponse<T> {
  body: T;
  code: number;
  errors: any | null;
  message: string;
}

export interface PricingResponse {
  base_price: number;
  sale_applied: boolean;
  sale_discount: number;
  promo_discount: number;
  final_price: number;
  promo: {
    id: number;
    code: string;
    type_discount: 0 | 1;
    value: number;
  } | null;
  context: {
    classroom_id: number;
    room_id: number | null;
  };
}
