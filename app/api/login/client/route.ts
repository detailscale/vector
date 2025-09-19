import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}) as any);
    const user = (body?.username || body?.studentId || "").toString();
    const password = (body?.password || "").toString();
    if (!user || !password) {
      return NextResponse.json(
        { error: "missing credentials" },
        { status: 400 },
      );
    }

    const basic = Buffer.from(`${user}:${password}`).toString("base64");

    const upstream = await fetch("http://localhost:5253/login/client", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/json",
      },
    });

    const data = (await upstream.json().catch(() => ({}))) as any;
    if (!upstream.ok) {
      const msg = data?.error || "login failed";
      return NextResponse.json({ error: msg }, { status: upstream.status });
    }

    const headerAuth = upstream.headers.get("authorization") || "";
    const tokenFromHeader = headerAuth.replace(/^Bearer\s+/i, "").trim();
    const token = (data && data.token) || tokenFromHeader;
    if (!token) {
      return NextResponse.json(
        { error: "missing token from upstream" },
        { status: 502 },
      );
    }

    const res = NextResponse.json({ ok: true });

    // TODO: validate token format
    res.cookies.set("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "unexpected error" }, { status: 500 });
  }
}
