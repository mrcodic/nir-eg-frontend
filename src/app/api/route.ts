// app/api/register/route.ts
import { buildApiUrl } from "@/helpers/fetch-utils";
import { getCookie } from "@/utils/api";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const reqUrl = new URL(req.url);
  const apiUrl = reqUrl.searchParams.get("url");
  const type = reqUrl.searchParams.get("type");
  const paths = req.nextUrl.searchParams.get("paths");

  try {
    const body = type === "formData" ? await req.formData() : await req.json();

    let token = await getCookie();
    const headersList = await headers();

    const cleanHost = headersList.get("host").replace(/:\d+$/, "");

    // school1.nir-edu.com → school1
    const [tenant] = cleanHost.split(".");

    const url = buildApiUrl(tenant, apiUrl);

    const response = await axios.post(url, body, {
      withCredentials: true,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: headersList.get("cookie"),
      },
    });

    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const cookiesStore = await cookies();
      setCookieHeader.forEach((cookie) => {
        const [cookieName, cookieValue] = cookie.split(";")[0].split("=");
        cookiesStore.set(cookieName, cookieValue, {
          path: "/",
          // httpOnly: true,
          // secure: true,
          sameSite: "lax",
        });
      });
    }

    if (paths) {
      if (paths.includes(",")) {
        const pathsArray = paths.split(",");
        pathsArray.forEach((path) => {
          revalidatePath(path, "layout");
        });
      } else {
        revalidatePath(paths, "layout");
      }
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Request failed",
        error: error.response?.data || error.message, // Return full API error
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function GET(req) {
  const encodedUrl = req.nextUrl.searchParams.get("url");
  const isGuest = req.nextUrl.searchParams.get("isGuest");
  const url = decodeURIComponent(encodedUrl);

  if (!url) {
    console.error("Missing URL");

    return NextResponse.json(
      { message: "Missing 'url' query param" },
      { status: 400 },
    );
  }

  try {
    let token = "";

    const headersList = await headers();

    if (!isGuest || isGuest === "false") {
      const cookieStore = await cookies();
      token = cookieStore.get("nir_token")?.value;
    }

    const cleanHost = headersList.get("host").replace(/:\d+$/, "");

    // school1.nir-edu.com → school1
    const [tenant] = cleanHost.split(".");

    const apiUrl = buildApiUrl(tenant, url);

    // const response = await getServerData({ queryKey: [url] });
    const response = await axios.get(apiUrl, {
      headers: {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: headersList.get("cookie"),
      },
    });

    const setCookieHeader = response.headers?.["set-cookie"];

    if (setCookieHeader) {
      const cookiesStore = await cookies();
      setCookieHeader.forEach((cookie) => {
        const [cookieName, cookieValue] = cookie.split(";")[0].split("=");
        cookiesStore.set(cookieName, cookieValue, {
          path: "/",
          // httpOnly: true,
          // secure: true,
          sameSite: "lax",
        });
      });
    }

    // console.log("proxy response : ", url, response);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);

    if (isRedirectError(error)) {
      return NextResponse.json(
        {
          shouldRedirect: true,
          redirectUrl: error.digest?.split(";")[2] || "/login",
        },
        { status: 307 },
      );
    }

    return NextResponse.json(
      {
        message: "Request failed",
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const queryURL = url.searchParams.get("url");

  try {
    let token = await getCookie();
    const headersList = await headers();
    const cleanHost = headersList.get("host").replace(/:\d+$/, "");

    // school1.nir-edu.com → school1
    const [tenant] = cleanHost.split(".");

    const apiUrl = buildApiUrl(tenant, queryURL);

    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Cookie: headersList.get("cookie"),
      },
    });

    await res.json();

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Request failed",
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 },
    );
  }
}
