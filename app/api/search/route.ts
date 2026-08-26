import { NextResponse } from "next/server";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:3001";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, gender, priceMin, priceMax } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { products: [], total: 0, error: "\u0639\u0628\u0627\u0631\u062a \u062c\u0633\u062a\u062c\u0648 \u062e\u06cc\u0644\u06cc \u06a9\u0648\u062a\u0627\u0647 \u0627\u0633\u062a (\u062d\u062f\u0627\u0642\u0644 \u06f2 \u062d\u0631\u0641)" },
        { status: 400 }
      );
    }

    // v1.0.0.3: source="web" → سرچ مستقل تلگرام (وابسته به DB نیست، ۵۰ محصول)
    const res = await fetch(`${BOT_URL}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, gender, priceMin, priceMax, source: "web" }),
      signal: AbortSignal.timeout(90000),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        products: data.products || [],
        total: 0,
        error: data.error || `\u062e\u0637\u0627\u06cc \u0633\u0631\u0648\u0631 \u0631\u0628\u0627\u062a (${res.status})`,
        hint: data.hint || null,
      }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({
      products: [],
      total: 0,
      error: e.message || "\u062e\u0637\u0627 \u062f\u0631 \u0627\u0631\u062a\u0628\u0627\u0637 \u0628\u0627 \u0631\u0628\u0627\u062a",
      hint: "\u0631\u0628\u0627\u062a \u0631\u0648\u06cc \u067e\u0648\u0631\u062a 3001 \u062f\u0631 \u062f\u0633\u062a\u0631\u0633 \u0646\u06cc\u0633\u062a",
    }, { status: 500 });
  }
}
