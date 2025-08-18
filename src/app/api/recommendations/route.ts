import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const upstream = await fetch(`${process.env.API_BASE}/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.API_TOKEN}` // server-only env var
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
