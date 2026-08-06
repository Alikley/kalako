import { NextRequest, NextResponse } from "next/server";

const BOT_API = process.env.BOT_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, gender, priceMin, priceMax } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query too short", products: [], total: 0 },
        { status: 400 }
      );
    }

    const res = await fetch(`${BOT_API}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, gender, priceMin, priceMax }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Bot API unavailable", products: [], total: 0 },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Cannot connect to bot", products: [], total: 0 },
      { status: 503 }
    );
  }
}
