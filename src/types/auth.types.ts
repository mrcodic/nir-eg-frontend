import { AuthErrorCode } from "./api-errors.types";

export type OtpSendPayload = {
  is_new: boolean;
  expires_at: string;
  otp_code?: string;
};

export type OtpSendResponse = {
  status: boolean;
  message: string;
  code: AuthErrorCode | string;
  data: OtpSendPayload | null;
  errors: Record<string, string[]> | null;
  is_new?: boolean;
  expires_at?: string;
  otp_code?: string;
};

export type OtpVerifyErrorResponse = {
  status: false;
  message: string;
  code: AuthErrorCode | string;
  data:
    | {
        attempts_remaining?: number;
        locked_for_minutes?: number;
        max_per_day?: number;
        used_today?: number;
      }
    | null;
  errors: Record<string, string[]> | null;
};

export type OtpVerifyResponse = {
  status: boolean;
  message: string;
  code: AuthErrorCode | string;
  data:
    | {
        verified: boolean;
        valid_until: string;
      }
    | null;
  errors: Record<string, string[]> | null;
};

export type AuthApiResponse = {
  status: boolean;
  message: string;
  code?: AuthErrorCode | string;
  data?: unknown;
  errors?: Record<string, string[]> | null;
};

export type JoinPrefillResponse = {
  status: boolean;
  message: string;
  code: AuthErrorCode | string;
  data?: Record<string, unknown> | null;
  errors: Record<string, string[]> | null;
};

export type LoginStudent = {
  id: number;
  first_name: string;
  last_name: string;
  code_country: string;
  avatar: string;
  type: number;
  phone: string;
  parent_phone: string;
  state_id: number;
  state_name: string;
  city: string | null;
  city_id: number;
  created_at: string;
  updated_at: string;
  grade: number;
  grade_name: string;
  group_link: string | null;
  points: number;
  student_phone_verification: boolean;
  parent_phone_verification: boolean;
  has_center?: boolean;
  center_id?: number;
  profile_completed?: boolean;
  missing_required?: string[];
};

export type LoginEnrollment = {
  tenant_id: string;
  name: string;
  slug: string;
  status: string;
  domain: string;
  domain_type: string;
  primary_color: string;
  tenant_status: number;
  tenant_user_id: number;
  source: string;
  enrolled_at: string;
  last_accessed_at: string | null;
};

export type LoginResponse = {
  status: boolean;
  message: string;
  student: LoginStudent;
  user_id: number;
  access_token: string;
  deeplink_token?: string;
  deeplink_expires_in?: number;
  enrollments?: LoginEnrollment[];
  profile_completed?: boolean;
  missing_required?: string[];
};

export type ProfileFieldType =
  | "text"
  | "phone"
  | "select"
  | "date"
  | "textarea"
  | "email"
  | "profile_attachments"
  | "file";

export type DynamicProfileFieldOption = {
  value: string | number;
  label: string;
};

export type ExistingProfileAttachment = {
  id: number;
  name?: string;
  file_name?: string;
  mime_type?: string;
  size?: number;
  url?: string;
};

export type ProfileAttachmentEntry = {
  id?: number;
  file?: File;
  name?: string;
  file_name?: string;
  url?: string;
};

export type DynamicProfileField = {
  key: string;
  label: string;
  type: ProfileFieldType;
  required: boolean;
  enabled: boolean;
  value:
    | string
    | number
    | null
    | unknown[]
    | ExistingProfileAttachment[]
    | ProfileAttachmentEntry[];
  options?: DynamicProfileFieldOption[];
  accept?: string[] | null;
  multiple?: boolean;
  max_files?: number;
  max_size_mb?: number;
};

export type StudentProfileFieldsResponse = {
  status: boolean;
  message: string;
  code: string;
  data: {
    profile_completed: boolean;
    missing_required: string[];
    fields: DynamicProfileField[];
  };
  errors: Record<string, string[]> | null;
};

export type StudentProfileSettingsResponse = StudentProfileFieldsResponse;

export type StudentProfileCompletePayload = Record<string, unknown> | FormData;
