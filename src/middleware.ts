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
const DESKTOP_BOOTSTRAP_PREFIX = "/desktop";

function isRouteMatch(pathname: string, routes: Set<string>) {
  return [...routes].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isDesktopBootstrapPath(pathname: string) {
  return (
    pathname === DESKTOP_BOOTSTRAP_PREFIX ||
    pathname.startsWith(`${DESKTOP_BOOTSTRAP_PREFIX}/`)
  );
}

/**
 * Edge-safe host extractor — reads directly from the request object.
 * No next/headers, no async, no external calls.
 */
function getBaseUrl(request: NextRequest): string {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    request.nextUrl.host;

  const protocol =
    request.headers.get("x-forwarded-proto") ??
    (host.endsWith(process.env.NEXT_PUBLIC_DEV_DOMAIN ?? "lvh.me")
      ? "http"
      : "https");

  return `${protocol}://${host}`;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  // Skip static and internal paths
  if (
    normalizedPath.startsWith("/_next") ||
    normalizedPath.startsWith("/assets") ||
    normalizedPath.includes(".")
  ) {
    return NextResponse.next();
  }

  console.log(pathname);

  if (!isDesktopBootstrapPath(pathname)) {
    const { subdomain } = await extractTenantFromHostServer();
    if (!subdomain) {
      const desktopUrl = new URL("/desktop", request.url);
      return NextResponse.redirect(desktopUrl);
    }
  }

  const token = request.cookies.get("nir_token")?.value;

  // Unauthenticated → protected route
  if (isRouteMatch(normalizedPath, PROTECTED_ROUTES) && !token) {
    console.log("normalizedPath !token ", normalizedPath);
    const loginUrl = new URL("/login", getBaseUrl(request));
    loginUrl.searchParams.set("next", normalizedPath);
    return NextResponse.redirect(loginUrl, { status: 307 });
  }

  // Authenticated → auth route
  if (isRouteMatch(normalizedPath, AUTH_ROUTES) && token) {
    const homeUrl = new URL("/profile", getBaseUrl(request));
    return NextResponse.redirect(homeUrl, { status: 307 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt).*)"],
};
