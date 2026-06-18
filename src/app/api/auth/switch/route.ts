import { isProd } from "@/utils/isProd";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
    secure: isProd,
  });

  // go to /bundles route
  return NextResponse.redirect(new URL("/profile", origin));
}
