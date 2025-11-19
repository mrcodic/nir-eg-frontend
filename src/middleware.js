import { NextResponse } from "next/server";

const protectedRoutes = [
  "/activities",
  "/grades",
  "/profile",
  "/store",
  "payment",
];

const authRoutes = ["/login", "/register"];

export function middleware(request) {
  const { pathname, searchParams, search } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const token = request.cookies.get("auth_token");
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAuth = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuth && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
