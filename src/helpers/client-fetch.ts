import reactCache from "@/helpers/reactCache";
import CustomError from "@/lib/customError";
import { IGetDataOptions } from "@/types/helpers.types";

import Cookies from "js-cookie";

const fetcherClient = async <T>(
  { queryKey: [endpoint], next, cache }: IGetDataOptions,
  authenticated: boolean
) => {
  if (!endpoint || typeof endpoint !== "string") {
    return null;
  }

  let token = "";

  if (authenticated) {
    token = Cookies.get("penguin_user_token") || "";
    if (!token) {
      return null;
    }
  }

  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`;
    // console.log("🚀 ~ fetcherClient ~ fullUrl:", fullUrl);
    const res = await fetch(fullUrl, {
      headers: {
        Accept: "application/json",
        ...(authenticated ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      next: {
        tags: [endpoint?.includes("?") ? endpoint?.split("?")[0] : endpoint],
        ...next,
      },
      cache: cache || "no-store",
    });

    if (!res.ok) {
      console.error(`💥 response : `, res);
      console.error(`Failed to fetch data from ${endpoint}`);
      throw new CustomError(
        `Failed to fetch data from ${endpoint}`,
        res.status || 500
      );
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`Error in fetcher for ${endpoint}:`, error);
    throw error;
  }
};

export const getClientPrivateData = reactCache(
  async <T>({
    queryKey: [endpoint],
    next,
    cache,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherClient({ queryKey: [endpoint], next, cache }, true)
);

// for client and server
export const getPublicData = reactCache(
  async <T>({
    queryKey: [endpoint],
    next,
    cache,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherClient({ queryKey: [endpoint], next, cache }, false)
);
