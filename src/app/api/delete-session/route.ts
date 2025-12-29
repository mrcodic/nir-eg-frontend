// DELETE USER COOKIE THEN REDIRECT TO LOGIN PAGE

import { deleteCookie } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await deleteCookie();
  return NextResponse.redirect(new URL("/login", req.url));
};
