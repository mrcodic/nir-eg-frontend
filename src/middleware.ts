import { NextRequest, NextResponse } from "next/server";
import { extractTenantFromHostServer } from "./helpers/fetchers/server-utils";

const PROTECTED_ROUTES = new Set([
  "/activities",
  "/grades",
  "/profile",
  "/store",
  "/payment",
  "/subscriptions",
]);

const AUTH_ROUTES = new Set(["/login", "/register"]);

function isRouteMatch(pathname: string, routes: Set<string>) {
  return [...routes].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("nir_token")?.value;
  const isProtected = isRouteMatch(pathname, PROTECTED_ROUTES);

  if (isProtected && !token) {
    try {
      const { host } = await extractTenantFromHostServer();
      const res = new NextResponse(null, { status: 307 });
      res.headers.set("Location", `${host}/login`);
      return res;
    } catch (err) {
      // return error in json format
      const res = NextResponse.json(
        {
          error: err,
        },
        { status: 500 },
      );
      return res;
    }
  }

  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);

  if (isAuthRoute && token) {
    try {
      const { host } = await extractTenantFromHostServer();
      const res = new NextResponse(null, { status: 307 });
      res.headers.set("Location", `${host}/`);
      return res;
    } catch (err) {
      // return error in json format
      const res = NextResponse.json(
        {
          error: err,
        },
        { status: 500 },
      );
      return res;
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt).*)"],
};
