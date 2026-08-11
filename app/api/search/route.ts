import { NextResponse } from "next/server";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:3001";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, gender, priceMin, priceMax } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { products: [], total: 0, error: "عبارت جستجو خیلی کوتاه است (حداقل ۲ حرف)" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BOT_URL}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, gender, priceMin, priceMax }),
      signal: AbortSignal.timeout(60000), // v4.10: 60s timeout
    });

    const data = await res.json();

    // v4.10: Pass through error info from bot
    if (!res.ok) {
      return NextResponse.json({
        products: data.products || [],
        total: 0,
        error: data.error || `خطای سرور ربات (${res.status})`,
        hint: data.hint || null,
      }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({
      products: [],
      total: 0,
      error: e.message || "خطا در ارتباط با ربات",
      hint: "ربات روی پورت 3001 در دسترس نیست",
    }, { status: 500 });
  }
}
