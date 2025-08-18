import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.API_KEY) {
    return NextResponse.json(
      { error: "API_KEY environment variable not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const upstream = await fetch(`${process.env.API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
