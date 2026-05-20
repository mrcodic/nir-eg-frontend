export type OtpSendPayload = {
  is_new: boolean;
  expires_at: string;
  otp_code?: string;
};

export type OtpSendResponse = {
  status: boolean;
  message: string;
  code: string;
  data: OtpSendPayload | null;
  errors: Record<string, string[]> | null;
  is_new?: boolean;
  expires_at?: string;
  otp_code?: string;
};

export type OtpVerifyErrorResponse = {
  status: false;
  message: string;
  code: "OTP_INVALID" | "OTP_LOCKED" | string;
  data:
    | {
        attempts_remaining?: number;
        locked_for_minutes?: number;
      }
    | null;
  errors: Record<string, string[]> | null;
};
