import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🔍 API route called - checking environment variables...");
  console.log("API_BASE:", process.env.API_BASE);
  console.log("API_KEY exists:", !!process.env.API_KEY);
  
  if (!process.env.API_KEY) {
    console.error("❌ API_KEY environment variable not configured");
    return NextResponse.json(
      { error: "API_KEY environment variable not configured" },
      { status: 500 }
    );
  }

  if (!process.env.API_BASE) {
    console.error("❌ API_BASE environment variable not configured");
    return NextResponse.json(
      { error: "API_BASE environment variable not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  console.log("📤 Request body:", body);
  console.log("🌐 Calling external API:", `${process.env.API_BASE}/analyze`);
  
  try {
    const upstream = await fetch(`${process.env.API_BASE}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    console.log("📥 External API response status:", upstream.status);
    
    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.error("❌ External API error:", errorText);
      return NextResponse.json(
        { error: `External API error: ${upstream.statusText}`, details: errorText },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    console.log("✅ External API response:", data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("💥 Error calling external API:", error);
    return NextResponse.json(
      { error: "Failed to call external API", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
