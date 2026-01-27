import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = new Set([
  "/activities",
  "/grades",
  "/profile",
  "/store",
  "/payment",
]);

const AUTH_ROUTES = new Set(["/login", "/register"]);

function isRouteMatch(pathname: string, routes: Set<string>) {
  return [...routes].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function middleware(request: NextRequest) {
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
  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);

  if (isProtected && !token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt).*)"],
};
