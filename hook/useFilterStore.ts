"use client";

import { create } from "zustand";

/**
 * v1.0.0.9: استور مشترک فیلترهای سایدبار
 *
 * قبلاً FilterSidebar فقط state محلی داشت که به هیچ چیزی وصیل نبود؛
 * حالا FilterSidebar (نوشتن) و ProductCards (خواندن + فیلتر) هر دو
 * از این استور استفاده می‌کنند و بدون prop drilling با هم صحبت می‌کنند.
 *
 * توجه: persist نمی‌کنیم — فیلتر باید با رفرش صفحه ریست بشه
 * (سازگار با رفتار «کلیک روی لوگو = شروع تازه» از v1.0.0.7)
 */

export const PRICE_MIN = 100000;
export const PRICE_MAX = 10000000;
export type PriceRange = [number, number];

export const DEFAULT_PRICE_RANGE: PriceRange = [PRICE_MIN, PRICE_MAX];

export interface FilterState {
  /** "" یعنی همه دسته‌ها */
  category: string;
  /** "" یعنی همه جنسیت‌ها */
  gender: string;
  /** بازه قیمت به تومان */
  priceRange: PriceRange;
  /** رنگ‌های انتخاب‌شده (چندتایی) */
  colors: string[];

  setCategory: (category: string) => void;
  setGender: (gender: string) => void;
  setPriceRange: (range: PriceRange) => void;
  toggleColor: (color: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: "",
  gender: "",
  priceRange: [...DEFAULT_PRICE_RANGE],
  colors: [],

  setCategory: (category) => set({ category }),
  setGender: (gender) => set({ gender }),
  setPriceRange: (priceRange) => set({ priceRange: [priceRange[0], priceRange[1]] }),
  toggleColor: (color) =>
    set((s) => ({
      colors: s.colors.includes(color)
        ? s.colors.filter((c) => c !== color)
        : [...s.colors, color],
    })),
  reset: () =>
    set({
      category: "",
      gender: "",
      priceRange: [...DEFAULT_PRICE_RANGE],
      colors: [],
    }),
}));

/** چند فیلتر فعاله؟ (برای شمارنده روی سایدبار) */
export function activeFilterCount(s: {
  category: string;
  gender: string;
  priceRange: PriceRange;
  colors: string[];
}): number {
  let n = 0;
  if (s.category) n++;
  if (s.gender) n++;
  if (s.colors.length > 0) n++;
  if (s.priceRange[0] > PRICE_MIN || s.priceRange[1] < PRICE_MAX) n++;
  return n;
}
