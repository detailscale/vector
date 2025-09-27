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

    const upstream = await fetch("http://localhost:5253/stores.json", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null as any);
    if (!upstream.ok) {
      const status = upstream.status || 502;
      const message =
        (data && (data.error || data.message)) || "upstream error";
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "unexpected server error" },
      { status: 500 },
    );
  }
}
