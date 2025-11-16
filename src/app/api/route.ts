import { instance } from "@/config/api";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const postData = async ([endpoint, data, method = "post"]: [
  string,
  unknown,
  string?
]) => {
  try {
    const token = (await cookies()).get("penguin_user_token")?.value || null;
    const headersList = await headers();

    const response = await instance.request({
      url: endpoint,
      method,
      data,
      withCredentials: true,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: headersList.get("cookie"),
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  const apiUrl = req.nextUrl.searchParams.get("url");
  const method = req.nextUrl.searchParams.get("method") || "post";
  const tags = req.nextUrl.searchParams.get("tags");
  const paths = req.nextUrl.searchParams.get("paths");
  const type = req.nextUrl.searchParams.get("type");

  // tag1,tag2,tag3 || tag1

  // console.log("api route cookie ", req.headers.get("cookie"));
  if (!apiUrl) {
    throw new Error("API URL is required");
  }

  try {
    let body;

    if (type === "formdata") {
      body = await req.formData();
    } else if (type === "nobody") {
      body = undefined;
    } else {
      body = await req.json();
    }

    const response = await postData([apiUrl, body, method]);

    const clientResponse = NextResponse.json(response.data, { status: 200 });

    // Copy headers from the API response to the client response
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, value]) => {
        if (value) {
          clientResponse.headers.set(
            key,
            Array.isArray(value) ? value.join(", ") : (value as string)
          );
        }
      });
    }

    if (tags) {
      if (tags.includes(",")) {
        const tagsArray = tags.split(",");
        tagsArray.forEach((tag) => {
          revalidateTag(tag, "max");
        });
      } else {
        console.log("revalidateTag : ", tags.trim());
        revalidateTag(tags, "max");
      }
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

    return clientResponse;
  } catch (error) {
    console.log("error 💥", error);
    return NextResponse.json(
      {
        message: error.message || "Request failed",
        error: error.response?.data || error.message, // Return full API error
        status: error.response?.status || 500,
      },
      { status: error.response?.status || 500 }
    );
  }
}

// get proxy
export async function GET(req: NextRequest) {
  const apiUrl = req.nextUrl.searchParams.get("url");

  try {
    const headersList = await headers();

    const response = await instance.get(apiUrl, {
      headers: {
        Cookie: headersList.get("cookie"),
      },
      withCredentials: true,
    });

    const clientResponse = NextResponse.json(response.data, { status: 200 });

    if (response.headers) {
      Object.entries(response.headers).forEach(([key, value]) => {
        if (value) {
          clientResponse.headers.set(
            key,
            Array.isArray(value) ? value.join(", ") : (value as string)
          );
        }
      });
    }

    return clientResponse;
  } catch (error) {
    const errorResponse = NextResponse.json(
      {
        message: "Request failed",
        error: error?.response?.data || error?.message,
        status: error?.response?.status || 500,
      },
      { status: error?.response?.status || 500 }
    );

    // Optionally add error headers if they exist
    if (error?.response?.headers) {
      Object.entries(error?.response.headers).forEach(([key, value]) => {
        if (value) {
          errorResponse.headers.set(
            key,
            Array.isArray(value) ? value?.join(", ") : (value as string)
          );
        }
      });
    }

    return errorResponse;
  }
}
