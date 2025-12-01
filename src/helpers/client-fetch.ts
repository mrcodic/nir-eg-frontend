import reactCache from "@/helpers/reactCache";
import { clientGetErrorhandler } from "@/lib/client-get-errorhandler";
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
    token = Cookies.get("nir_token") || "";
    if (!token) {
      return null;
    }
  }

  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${
      endpoint.startsWith("/") ? "" : "/"
    }${endpoint}`;
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
        // console.error(`Failed to fetch data from ${endpoint}`);
        throw new CustomError(
          `Failed to fetch data from ${endpoint}`,
          res.status || 500
        );
      }
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(
      `Error in fetcher for ${endpoint}:`,
      error,
      error.status,
      error instanceof CustomError
    );
    clientGetErrorhandler(error);
    // throw error;
  }
};

export const getClientPrivateData = reactCache(
  async <T = any>({
    queryKey: [endpoint],
    next,
    cache,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherClient({ queryKey: [endpoint], next, cache }, true)
);

// console.log("getClientPrivateData error : ", endpoint, error);
//       clientGetErrorhandler(error);

// for client and server
export const getPublicData = reactCache(
  async <T = any>({
    queryKey: [endpoint],
    next,
    cache,
    isAuth = false,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherClient({ queryKey: [endpoint], next, cache }, isAuth)
);
