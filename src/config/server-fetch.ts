import "server-only";
import reactCache from "@/config/reactCache";
import CustomError from "@/lib/customError";
import { IGetDataOptions } from "@/services/types";
import { cookies } from "next/headers";

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
    token = cookiesStore.get("penguin_user_token")?.value || "";

    if (!token) {
      return null;
    }
  }

  try {
    const fullUrl = `${process.env.BASE_URL}${endpoint}`;
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

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`Error in fetcher for ${endpoint}:`, error);
    if (error instanceof CustomError) {
      console.log("custom error ");
      throw error;
    } else {
      throw new CustomError(`Failed to fetch data from ${endpoint}`, 500);
    }
  }
};

// export const getServerPublicData = reactCache(
//   async <T>({
//     queryKey: [endpoint],
//     next,
//     cache,
//   }: IGetDataOptions): Promise<T | null> =>
//     fetcherServer({ queryKey: [endpoint], next, cache }, false),
// );

export const getServerPrivateData = reactCache(
  async <T>({
    queryKey: [endpoint],
    next,
    cache,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherServer({ queryKey: [endpoint], next, cache }, true),
);
