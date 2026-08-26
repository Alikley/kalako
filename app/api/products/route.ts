import { NextResponse } from "next/server";
import {
  isGroupTitle,
  matchesGroup,
  MAX_CATEGORY_POSTS,
} from "@/lib/categoryGroups";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:3001";
const DEFAULT_PAGE_SIZE = 20;

/**
 * v1.0.3.0: پشتیبانی دسته‌بندی‌های ۷گانه + رفع سقف‌ها
 *
 * کاربر: «میخوام گزینه برند هارو توی نوبار حذف کنی بعد گزینه دسته بندی هارو
 *         ... هرکدوم گزینه دست بندی 200 تا پست»
 *
 *  - cat حالا می‌تونه اسم یکی از ۷ گروه باشه (پوشاک/لوازم برقی خانه/...) —
 *    فیلتر با clothingType محصولات (نوع ظریف عضو گروه) انجام میشه و نتایج
 *    به 200 پست محدود میشن (MAX_CATEGORY_POSTS)
 *  - cat نوع ظریف (مثل «کتونی») هم هنوز کار میکنه (سازگاری قبلی)
 *  - سقف limit از 100 به 1000 افزایش یافت — بات الان ~600 محصول داره
 *    (کاربر: «میخوام 600 تا پست پیدا کنی»)
 *  - پارامتر interleave به بات فوروارد میشه (حالت raw برای فیلتر کلاینت)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("cat");
  const brand = searchParams.get("brand");
  const discount = searchParams.get("discount");
  const interleave = searchParams.get("interleave");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    1000,
    Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );

  try {
    // v1.0.3.0: بات الان ~600 محصول داره → limit=1000 (سقف بات v1.1.4.0)
    const botParams = new URLSearchParams();
    botParams.set("limit", "1000");
    if (interleave) botParams.set("interleave", interleave);
    if (cat && !isGroupTitle(cat)) botParams.set("cat", cat);

    const res = await fetch(`${BOT_URL}/api/products?${botParams.toString()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(60000),
    });

    const data = await res.json();

    let results = data.products || [];

    // v1.0.3.0: فیلتر گروه دسته‌بندی — clothingType باید عضو گروه باشه
    // (نوع ظریف ذخیره‌شده بات v1.1.4.0)
    if (cat) {
      if (isGroupTitle(cat)) {
        results = results.filter((p: any) => matchesGroup(p.clothingType || "", cat));
        // cap ‏200 پست برای هر دسته (کاربر: «هرکدوم گزینه دست بندی 200 تا پست»)
        results = results.slice(0, MAX_CATEGORY_POSTS);
      } else {
        // نوع ظریف — clothingType بات یا fallback عنوان
        results = results.filter(
          (p: any) =>
            (p.clothingType && p.clothingType.replace(/\u200c/g, "") === cat.replace(/\u200c/g, "")) ||
            p.title?.includes(cat)
        );
      }
    }

    // v5.12: فیلتر تخفیف — بات price/oldPrice برمی‌گردونه، discount رو خودمون حساب می‌کنیم
    if (discount === "true")
      results = results.filter((p: any) => p.oldPrice && p.price && Number(p.oldPrice) > Number(p.price));
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
      category: cat || null,
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
