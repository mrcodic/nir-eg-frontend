import CustomError from "@/lib/customError";
import { IGetDataOptions } from "@/types/helpers.types";
import { deleteCookie } from "@/utils/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
import reactCache from "./reactCache";

const fetcherServer = async <T>(
  { queryKey: [endpoint], next, cache }: IGetDataOptions,
  authenticated: boolean
) => {
  if (!endpoint || typeof endpoint !== "string") {
    return null;
  }

  let token = "";

  if (authenticated) {
    const cookiesStore = await cookies();
    token = cookiesStore.get("nir_token")?.value || "";

    if (!token && endpoint.includes("students/profile")) {
      return null;
    }
  }

  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;

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
        console.error(`💥 response : `, data);
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
    console.error(`Error in fetcher for ${endpoint}:`, error);
    if (error?.response?.data?.code === 403) {
      console.log("unauth redirect");

      redirect("/unAuth");
    } else if (error?.status === 403) {
      console.log("unauth center redirect");
      redirect("/unAuthCenter");
    } else if (error?.status == 401 || error?.response?.data?.code == 410) {
      console.log("login redirect");
      await deleteCookie();
      redirect("/login");
    } else if (error instanceof CustomError) {
      console.log("custom error redirect");
      throw error;
    } else {
      throw new CustomError(`Failed to fetch data from ${endpoint}`, 500);
    }
  }
};

export const getServerData = reactCache(
  async <T = any>({
    queryKey: [endpoint],
    next,
    cache,
    isAuth = true,
  }: IGetDataOptions): Promise<T | null> =>
    fetcherServer({ queryKey: [endpoint], next, cache }, isAuth)
);
