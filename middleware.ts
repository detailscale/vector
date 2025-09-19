import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/login" || pathname === "/ops/login") {
    return NextResponse.next();
  }

  const isProtectedRoot = pathname === "/";
  const isProtectedOps = pathname === "/ops" || pathname.startsWith("/ops/");

  // TODO: check token validity, expiration
  if (isProtectedRoot || isProtectedOps) {
    const token = req.cookies.get("jwt")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/ops/:path*", "/login", "/ops/login"],
};
