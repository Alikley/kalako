/**
 * ساختار دسته‌بندی مشترک سایت و بات — v1.0.3.0
 *
 * کاربر: «دسته بندی شامل اینه:
 *   پوشاک: تی شرت شلوار لباس هودی پالتو کتونی کفش شومیز شرت
 *   لوازم برقی خانه: یخچال تلویزیون کولرگازی اجاق گاز جاروبرقی
 *   لوازم خانه: قابلمه ظرف مبل صندلی
 *   موبایل
 *   لب تاپ
 *   لوازم جانبی موبایل: هندزفری هدفون سیم شارژ اداپتور موبایل قاب گوشی
 *   کتاب»
 *
 * این نقشه دقیقاً هماهنگ با CATEGORY_GROUPS بات (clothes_bot v1.1.4.0)
 * هست — بات هر محصول رو با clothing_type = نوع ظریف ذخیره میکنه و سایت
 * با همین نقشه نوع ظریف → گروه تبدیل میکنه.
 *
 * استفاده‌ها:
 *  - نوبار: فقط ۷ تایتل گروه رو نشون میده (کاربر: «فقط تایتل رو توی دسته
 *    بندی نشون بده»)
 *  - کلیک روی گروه → /?cat=<گروه> → نمایش محصولات اون گروه (حداکثر 200 پست)
 *  - باکس فیلتر: در حالت دسته‌بندی فقط گزینه‌های همون گروه، در حالت دیفالت
 *    کل هشتگ‌ها (کاربر: «در حالت دیفالت میخوام باکس فیلتر کل هشتگ های هست
 *    رو نشون بده»)
 */

export const CATEGORY_GROUPS: Record<string, string[]> = {
  "پوشاک": [
    "تی\u200cشرت",
    "شلوار",
    "لباس",
    "هودی",
    "پالتو",
    "کتونی",
    "کفش",
    "شومیز",
    "شورت",
  ],
  "لوازم برقی خانه": ["یخچال", "تلویزیون", "کولرگازی", "اجاق گاز", "جاروبرقی"],
  "لوازم خانه": ["قابلمه", "ظرف", "مبل", "صندلی"],
  "موبایل": ["موبایل"],
  "لب تاپ": ["لب تاپ"],
  "لوازم جانبی موبایل": [
    "هندزفری",
    "هدفون",
    "سیم شارژ",
    "اداپتور موبایل",
    "قاب گوشی",
  ],
  "کتاب": ["کتاب"],
};

/** ۷ تایتل گروه — برای نوبار و دراپ‌داون‌ها */
export const GROUP_TITLES = Object.keys(CATEGORY_GROUPS);

/** همه انواع ظریف (26 هشتگ/دسته) — برای باکس فیلتر حالت دیفالت */
export const ALL_TYPES: string[] = GROUP_TITLES.flatMap((g) => CATEGORY_GROUPS[g]);

/** حداکثر پست برای هر گزینه دسته‌بندی (کاربر: «هرکدوم گزینه دست بندی 200 تا پست») */
export const MAX_CATEGORY_POSTS = 200;

/** حذف نیم‌فاصله برای مقایسه امن («تی‌شرت» و «تیشرت») */
export function normalizeFa(s: string): string {
  return (s || "").replace(/\u200c/g, "");
}

/** آیا این اسم، اسم یکی از ۷ گروهه؟ */
export function isGroupTitle(s: string): boolean {
  return Object.prototype.hasOwnProperty.call(CATEGORY_GROUPS, s);
}

/** انواع ظریف یک گروه — اگه گروه نبود خودش به‌عنوان نوع ظریف برمی‌گرده */
export function typesOfGroup(group: string): string[] {
  return CATEGORY_GROUPS[group] || [group];
}

/** گروهِ یک نوع ظریف — اگه پیدا نشد "" */
export function groupOfType(type: string): string {
  const nt = normalizeFa(type);
  for (const g of GROUP_TITLES) {
    if (CATEGORY_GROUPS[g].some((t) => normalizeFa(t) === nt)) return g;
  }
  return "";
}

/** تطبیق دسته با clothingType محصول — نوع ظریف باید عضو گروه باشه */
export function matchesGroup(clothingType: string, group: string): boolean {
  const nct = normalizeFa(clothingType || "");
  if (!nct) return false;
  return typesOfGroup(group).some((t) => normalizeFa(t) === nct);
}
