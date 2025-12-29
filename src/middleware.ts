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
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const token = request.cookies.get("nir_token");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuth && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
