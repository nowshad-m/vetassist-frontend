import { NextRequest, NextResponse } from "next/server";
import sample from "@/data/sample-response.json";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.clinical_notes || !String(body.clinical_notes).trim()) {
    return NextResponse.json({ error: "Clinical notes are required" }, { status: 400 });
  }
  await new Promise(r => setTimeout(r, 600));
  return NextResponse.json(sample);
}
