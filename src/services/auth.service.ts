import { buildApiUrl, extractTenantFromHost } from "@/helpers/fetch-utils";
import {
  AuthApiResponse,
  JoinPrefillResponse,
  LoginResponse,
  OtpSendResponse,
  OtpVerifyResponse,
} from "@/types/auth.types";
import axios, { Method } from "axios";
import Cookies from "js-cookie";

type AuthRequestOptions = {
  auth?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
};

async function authRequest<TResponse>(
  endpoint: string,
  method: Method,
  body?: unknown,
  options: AuthRequestOptions = {},
): Promise<TResponse> {
  const token = Cookies.get("nir_token");
  const { subdomain, host } = extractTenantFromHost();

  const response = await axios.request<TResponse>({
    url: buildApiUrl(subdomain, endpoint),
    method,
    data: body,
    params: options.params,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "X-Tenant-Domain": host,
      ...(options.auth || token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
}

export function sendAuthOtpCode(phone: string): Promise<OtpSendResponse> {
  return authRequest<OtpSendResponse>("/auth/otp/send", "POST", { phone });
}

export function verifyAuthOtpCode(payload: {
  phone: string;
  otp_code: string;
}): Promise<OtpVerifyResponse> {
  return authRequest<OtpVerifyResponse>("/auth/otp/verify", "POST", payload);
}

export function loginWithPhonePassword(payload: {
  phone: string;
  country: string;
  country_iso: string;
  password: string;
  recaptcha_token?: string;
}): Promise<LoginResponse> {
  return authRequest<LoginResponse>("/auth/login", "POST", payload);
}

export function registerStudentAccount(
  payload: Record<string, unknown>,
): Promise<AuthApiResponse> {
  return authRequest<AuthApiResponse>("/auth/register", "POST", payload);
}

export function joinPrefilledStudent(
  phone: string,
): Promise<JoinPrefillResponse> {
  return authRequest<JoinPrefillResponse>("/auth/join/prefill", "GET", null, {
    params: { phone },
  });
}

export function submitJoinEnrollment(
  payload: Record<string, unknown>,
): Promise<AuthApiResponse> {
  return authRequest<AuthApiResponse>("/auth/join", "POST", payload);
}
