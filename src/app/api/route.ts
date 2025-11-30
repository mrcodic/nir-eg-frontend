// app/api/register/route.ts
import { getCookie, postData } from "@/utils/api";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export async function POST(req) {
  const url = new URL(req.url);
  const apiUrl = url.searchParams.get("url");
  const type = url.searchParams.get("type");
  const paths = req.nextUrl.searchParams.get("paths");

  try {
    const body = type === "formData" ? await req.formData() : await req.json();

    const response = await postData([apiUrl, body]);
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
      { status: error.response?.status || 500 }
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
      { status: 400 }
    );
  }

  try {
    let token = "";

    const headersList = await headers();

    if (!isGuest || isGuest === "false") {
      const cookieStore = await cookies();
      token = cookieStore.get("nir_token")?.value;
    }

    // const response = await getServerPrivateData({ queryKey: [url] });
    const response = await instance.get(url, {
      headers: {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: headersList.get("cookie"),
      },
    });

    const setCookieHeader = response.headers?.["set-cookie"];

    if (setCookieHeader) {
      const cookiesStore = await cookies(); // Await cookies() only once
      setCookieHeader.forEach((cookie) => {
        const [cookieName, cookieValue] = cookie.split(";")[0].split("="); // Extract name and value
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
    // console.error("Error in GET request:", error);

    // cant handle redirect error in client side so we do it manually
    if (isRedirectError(error)) {
      // console.log("🚀 ~ GET ~ error: is redirect error ", url);
      // throw error;

      return NextResponse.json(
        {
          shouldRedirect: true,
          redirectUrl: error.digest?.split(";")[2] || "/login",
        },
        { status: 307 }
      );
    }

    return NextResponse.json(
      {
        message: "Request failed",
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const apiUrl = url.searchParams.get("url");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    let token = await getCookie();
    const headersList = await headers();

    const res = await fetch(baseUrl + apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Cookie: headersList.get("cookie"),
      },
    });

    const data = await res.json();
    console.log("delete dataaaaaaaaa : ", data);

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Request failed",
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 }
    );
  }
}
