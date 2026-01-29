import reactCache from "@/config/reactCache";
import { IGetDataOptions } from "@/types/services.types";
import { cookies } from "next/headers";
import "server-only";
import CustomError from "./CustomError";

const fetcherServer = async <T>(
  { queryKey: [endpoint], next, cache }: IGetDataOptions,
  authenticated: boolean,
) => {
  if (!endpoint || typeof endpoint !== "string") {
    return null;
  }

  let token = "";

  if (authenticated) {
    const cookiesStore = await cookies();
    token = cookiesStore.get("user_token")?.value || "";

    if (!token) {
      return null;
    }
  }

  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
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
      console.log("res : ", res);
      try {
        const data = await res.json();
        console.error(`💥 response : `, data);
        throw new CustomError(data.message, res.status || 500);
      } catch (error) {
        console.error(`💥 response err : `, res);
        // console.error(`Failed to fetch data from ${endpoint}`);
        throw new CustomError(
          `Failed to fetch data from ${endpoint}`,
          res.status || 500,
        );
      }
    }

    return (await res.json()) as Promise<T>;
  } catch (error) {
    console.error(`Error in fetcher for ${endpoint}:`, error);
    if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError(`Failed to fetch data from ${endpoint}`, 500);
    }
  }
};

export const getServerData = reactCache(
  async <T>({
    queryKey: [endpoint],
    next,
    cache,
    isAuth = true,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherServer({ queryKey: [endpoint], next, cache }, isAuth),
);
