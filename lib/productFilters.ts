import type { Product } from "@/hook/useStore";
import { PRICE_MIN, PRICE_MAX, type PriceRange } from "@/hook/useFilterStore";

/**
 * v1.0.0.9: منطق فیلتر محصولات سمت کلاینت
 *
 * فیلتر روی «محصولاتی که داخل صفحه هستن» اعمال میشه —
 * هم لیست عادی محصولات و هم نتایج جستجو.
 */

export interface ProductFilters {
  category: string;
  gender: string;
  priceRange: PriceRange;
  colors: string[];
}

/** آیا بازه قیمت از حالت پیش‌فرض فاصله گرفته؟ */
export function isPriceFilterActive(range: PriceRange): boolean {
  return range[0] > PRICE_MIN || range[1] < PRICE_MAX;
}

/** آیا هیچ فیلتری فعاله؟ */
export function hasActiveFilters(f: ProductFilters): boolean {
  return (
    f.category !== "" ||
    f.gender !== "" ||
    f.colors.length > 0 ||
    isPriceFilterActive(f.priceRange)
  );
}

/**
 * مترادف‌های رایج رنگ‌ها برای تطبیق متنی در عنوان محصول
 * (بات فیلد رنگ نداره؛ بهترین راه موجود، جستجوی نام رنگ در عنوان است)
 */
const COLOR_SYNONYMS: Record<string, string[]> = {
  "سیاه": ["سیاه", "مشکی", "black"],
  "سفید": ["سفید", "سپید", "white"],
  "قرمز": ["قرمز", "زرشکی", "red"],
  "آبی": ["آبی", "سرمه‌ای", "blue"],
  "سبز": ["سبز", "green"],
  "زرد": ["زرد", "خردلی", "yellow"],
};

/** تطبیق دسته: clothingType بات یا جستجوی عنوان (برای نتایج سرچ که clothingType ندارن) */
function matchesCategory(p: Product, category: string): boolean {
  if (!category) return true;
  const ct = p.clothingType || "";
  if (ct) {
    // نوع محصول بات با دسته فیلتر یکی باشه
    // (حذف نیم‌فاصله برای مقایسه امن: «تی‌شرت» و «تیشرت»)
    const norm = (s: string) => s.replace(/\u200c/g, "");
    if (norm(ct) === norm(category)) return true;
    // دسته‌های والد: «کتونی» زیرمجموعه «کفش» حساب میشه و برعکس
    if (norm(ct).includes(norm(category)) || norm(category).includes(norm(ct))) return true;
  }
  // fallback: نام دسته در عنوان محصول
  return (p.title || "").replace(/\u200c/g, "").includes(category.replace(/\u200c/g, ""));
}

/** تطبیق جنسیت: فیلد gender بات یا جستجوی عنوان */
function matchesGender(p: Product, gender: string): boolean {
  if (!gender) return true;
  const g = p.gender || "";
  if (g) return g === gender;
  return (p.title || "").includes(gender);
}

/** تطبیق قیمت: فقط وقتی بازه از پیش‌فرض فاصله گرفته محصولات بدون قیمت حذف میشن */
function matchesPrice(p: Product, range: PriceRange): boolean {
  if (!isPriceFilterActive(range)) return true;
  if (p.price == null) return false;
  return p.price >= range[0] && p.price <= range[1];
}

/** تطبیق رنگ: نام رنگ یا مترادفش در عنوان (بات فیلد رنگ ندارد) */
function matchesColors(p: Product, colors: string[]): boolean {
  if (!colors || colors.length === 0) return true;
  const title = p.title || "";
  return colors.some((color) => {
    const syns = COLOR_SYNONYMS[color] || [color];
    return syns.some((syn) => title.includes(syn));
  });
}

/** اعمال همه فیلترها روی لیست محصولات */
export function applyProductFilters(
  products: Product[],
  f: ProductFilters
): Product[] {
  if (!hasActiveFilters(f)) return products;
  return products.filter(
    (p) =>
      matchesCategory(p, f.category) &&
      matchesGender(p, f.gender) &&
      matchesPrice(p, f.priceRange) &&
      matchesColors(p, f.colors)
  );
}
