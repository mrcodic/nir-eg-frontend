import reactCache from "@/config/reactCache";
import { IGetDataOptions } from "@/types/services.types";
import Cookies from "js-cookie";
import CustomError from "./CustomError";

const fetcherClient = async <T>(
  { queryKey: [endpoint], next, cache }: IGetDataOptions,
  authenticated: boolean,
) => {
  if (!endpoint || typeof endpoint !== "string") {
    return null;
  }

  let token = "";

  if (authenticated) {
    token = Cookies.get("user_token") || "";
    if (!token) {
      return null;
    }
  }

  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    // console.log("🚀 ~ fetcherClient ~ fullUrl:", fullUrl);
    const res = await fetch(fullUrl, {
      headers: {
        Accept: "application/json",
        ...(authenticated ? { Authorization: `Bearer ${token}` } : {}),
      },
      // credentials: "include",
      next: {
        tags: [endpoint?.includes("?") ? endpoint?.split("?")[0] : endpoint],
        revalidate: 0,
        ...next,
      },
      cache: cache || "default",
    });

    if (!res.ok) {
      console.log("res : ", res);
      try {
        const data = await res.json();
        console.error(`💥 response : `, data, data.message, res.status);
        throw new CustomError(data.message, res.status || 500);
      } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        console.error(`💥 response err : `, res);

        throw new CustomError(
          `Failed to fetch data from ${endpoint}`,
          res.status || 500,
        );
      }
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
    fetcherClient({ queryKey: [endpoint], next, cache }, true),
);

// for client and server
export const getPublicData = reactCache(
  async <T>({
    queryKey: [endpoint],
    next,
    cache,
    isAuth = false,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherClient({ queryKey: [endpoint], next, cache }, isAuth),
);
