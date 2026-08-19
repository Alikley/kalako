import { NextResponse } from "next/server";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:3001";
const DEFAULT_PAGE_SIZE = 20;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const brand = searchParams.get("brand");
  const discount = searchParams.get("discount");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE));

  try {
    // به ربات میگیم همه محصولات رو بفرسته (حداکثر ۵۰۰ تا)
    const res = await fetch(`${BOT_URL}/api/products?limit=500`, {
      cache: "no-store",
      signal: AbortSignal.timeout(60000),
    });

    const data = await res.json();

    let results = data.products || [];

    // v5.12: فیلتر تخفیف — بات price/oldPrice برمی‌گردونه، discount رو خودمون حساب می‌کنیم
    if (discount === "true")
      results = results.filter((p: any) => p.oldPrice && p.price && Number(p.oldPrice) > Number(p.price));
    if (cat) results = results.filter((p: any) => p.title?.includes(cat));
    if (brand)
      results = results.filter(
        (p: any) =>
          p.channelTitle?.includes(brand) || p.channelId?.includes(brand)
      );

    const total = results.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const paginatedResults = results.slice(offset, offset + limit);

    return NextResponse.json({
      products: paginatedResults,
      total,
      page: safePage,
      totalPages,
      pageSize: limit,
      _meta: {
        cached: data.cached || false,
        stale: data.stale || false,
        searching: data.searching || false,
        source: data.source || null,
        botError: data.error || null,
        botHint: data.hint || null,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      products: [],
      total: 0,
      page: 1,
      totalPages: 1,
      pageSize: limit,
      _meta: {
        cached: false,
        connectionError: true,
        error: e.message || "Bot API unreachable",
        hint: "ربات روی پورت 3001 در دسترس نیست. مطمئن شوید ربات اجرا شده است.",
      },
    });
  }
}
