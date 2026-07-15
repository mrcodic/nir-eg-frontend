"use server";

import { mutateServer } from "@/helpers/fetchers/post-server";
import { revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";
// import "nprogress/nprogress.css";

// const { subdomain } = await extractTenantFromHostServer();
// const tenantUrl = buildTenantApiBase(subdomain);

// export const serverInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// });

export const postTamperAttempt = async ({
  message,
  timestamp,
  userAgent,
  screen,
  tz,
  lang,
}) => {
  try {
    // console.log({ message, timestamp, userAgent, screen, tz, lang });
    const authToken = await getCookie();

    if (!authToken) {
      console.log("No auth token found");
      return;
    }

    // Get client IP from headers
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const remoteAddr = headersList.get("remote-addr");

    // Get the client IP (prioritize x-forwarded-for)
    const userIp = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || remoteAddr || "unknown";

    const ua = userAgent || headersList.get("user-agent");

    const body = {
      message,
      timestamp,
      ip: userIp,
      client: [userIp, ua, screen, tz, lang],
    };

    const res = await mutateServer("/sensors/ingest", body, {
      auth: true,
    });

    // console.log("Tamper attempt logged:", res?.data);
    return res?.data;
  } catch (error) {
    console.error("Error logging tamper attempt:", error);
    throw new Error(`Failed to log tamper attempt: ${error.message}`);
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

export async function revalidateTagAction(tag: string) {
  revalidateTag(tag);
}
