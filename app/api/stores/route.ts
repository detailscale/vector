import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("jwt")?.value || "";
    if (!token) {
      return NextResponse.json(
        { error: "!token", quickDrop: "true" },
        { status: 401 },
      );
    }

    const upstream = await fetch("http://localhost:5253/stores", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await upstream.text();
    const contentType =
      upstream.headers.get("content-type") || "application/json";
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "content-type": contentType },
    });
  } catch (err) {
    return NextResponse.json({ error: "proxy error" }, { status: 502 });
  }
}
