import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const nextParam = request.nextUrl.searchParams.get("next") ?? "/";

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const safeNext = nextParam.startsWith("/") ? nextParam : "/";
  const hostHeader =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const protoHeader =
    request.headers.get("x-forwarded-proto") ||
    request.nextUrl.protocol.replace(":", "");
  const origin = `${protoHeader}://${hostHeader}`;

  const cookieStore = await cookies();
  cookieStore.set("nir_token", token, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.redirect(new URL(safeNext, origin));
}
