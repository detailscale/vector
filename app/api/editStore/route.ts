import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const jwt = req.cookies.get("jwt")?.value;
    if (!jwt) {
      return NextResponse.json({ error: "missing auth" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (body === null) {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    const upstream = await fetch(`${process.env.BACKEND_URL}/editStore`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const msg = (data as any)?.error || "store update failed";
      return NextResponse.json({ error: msg }, { status: upstream.status });
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    return NextResponse.json(
      { error: "unexpected upstream error" },
      { status: 500 },
    );
  }
}
