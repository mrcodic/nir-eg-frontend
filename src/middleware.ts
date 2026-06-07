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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (!isDesktopBootstrapPath(pathname)) {
    const { subdomain } = await extractTenantFromHostServer();
    if (!subdomain) {
      const desktopUrl = new URL("/desktop", request.url);
      return NextResponse.redirect(desktopUrl, {
        request: { headers: requestHeaders },
      });
    }
  }

  const token = request.cookies.get("nir_token")?.value;
  const isProtected = isRouteMatch(pathname, PROTECTED_ROUTES);

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url), {
      request: { headers: requestHeaders },
    });
  }

  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url), {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt).*)"],
};
