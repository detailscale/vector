import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const res = NextResponse.redirect(
    new URL(
      "/login",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
  );

  const cookieBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };

  res.cookies.set("jwt", "", cookieBase);
  res.cookies.set("token", "", cookieBase);
  res.cookies.set("auth", "", cookieBase);

  return res;
}
