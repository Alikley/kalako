import { NextResponse } from "next/server";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:3001";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, gender, priceMin, priceMax } = body;
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ products: [], total: 0 }, { status: 400 });
    }
    const res = await fetch(`${BOT_URL}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, gender, priceMin, priceMax }),
    });
    if (!res.ok) throw new Error("Bot API error");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ products: [], total: 0 }, { status: 500 });
  }
}
