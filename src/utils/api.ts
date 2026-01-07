"use server";

import { getServerData } from "@/helpers/server-fetch";
import axios from "axios";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import "nprogress/nprogress.css";

// export const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// });

export const logoutAction = async () => {
  await deleteCookie();
  redirect("/login");
};

export async function handleServerError(error) {
  try {
    if (isRedirectError(error)) throw error;
    if (error && error.message === "Unauthorized") await logoutAction();

    if (axios.isAxiosError(error)) {
      const response = error.response;
      if (
        response?.statusText === "Unauthorized" ||
        response?.data?.message === "Unauthorized"
      )
        await logoutAction();
      if (response && response.data) {
        const { message, statusCode } = response.data;
        // Handle specific status code 409
        if (statusCode !== 200) {
          return { message, statusCode };
        }
        return { message, statusCode };
      }
      if (error.code === "ECONNREFUSED") {
        return {
          message:
            "Connection refused. Please try again later or contact support.",
          statusCode: 500,
        };
      }
    } else {
      return {
        message:
          "Unknown server error, Please try again later or contact support.",
        statusCode: 500,
      };
    }
  } catch (catchError) {
    if (isRedirectError(catchError)) throw catchError;
    return { message: catchError.message, statusCode: 500 };
  }
}

export const postTamperAttempt = async ({
  message,
  timestamp,
  userAgent,
  screen,
  tz,
  lang,
}) => {
  try {
    // Get client IP from headers
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const remoteAddr = headersList.get("remote-addr");

    // Get the client IP (prioritize x-forwarded-for)
    const userIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || remoteAddr || "unknown";

    const authToken = await getCookie();

    if (!authToken) {
      console.log("No auth token found");
      return;
    }
    const ua = userAgent || headersList.get("user-agent");

    const body = {
      message,
      timestamp,
      ip: userIp,
      client: [userIp, ua, screen, tz, lang],
    };

    const res = await axios.post("/sensors/ingest", body, {
      headers: {
        Authorization: `Bearer ${JSON.parse(authToken)}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Tamper attempt logged:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error logging tamper attempt:", error);
    throw new Error(`Failed to log tamper attempt: ${error.message}`);
  }
};

export const postData = async ([endpoint, body]) => {
  try {
    let token = await getCookie();
    const headersList = await headers();

    const response = await axios.post(endpoint, body, {
      withCredentials: true,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: headersList.get("cookie"),
      },
    });

    return response;
  } catch (error) {
    console.log("postData error : ", endpoint, error);
    throw error;
  }
};

export const postCommentData = async (endpoint, body) => {
  try {
    let token = await getCookie();

    const response = await axios.post(endpoint, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const postFormData = async (body) => {
  try {
    let token = await getCookie();

    const response = await axios.post("/students/profile/edit", body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOtp = async (phone) => {
  try {
    const response = await axios.post("/otp/request", {
      phone,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProfile = async () => {
  try {
    const response = await getServerData({
      queryKey: ["/students/profile"],
      isAuth: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveCookie = async (token) => {
  const cookieStore = await cookies();
  cookieStore.set("nir_token", token);
};

export const getCookie = async (name: string = "nir_token") => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
};

export const getDeviceCode = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("device_code")?.value || null;
};

export const deleteCookie = async (name: string[] | string = "nir_token") => {
  "use server";

  const cookieStore = await cookies();

  if (typeof name === "string") {
    cookieStore.delete(name);
  } else {
    name.forEach((name) => {
      cookieStore.delete(name);
    });
  }
};
