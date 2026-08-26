"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "./useStore";
import { buildImageUrl } from "../lib/postId";

export interface BotMeta {
  cached?: boolean;
  stale?: boolean;
  searching?: boolean;
  connectionError?: boolean;
  botError?: string | null;
  botHint?: string | null;
  error?: string | null;
  hint?: string | null;
  source?: string;
}

/**
 * v1.0.2.0: PRODUCTS_PER_PAGE از 250 به 24 برگردونده شد
 *
 * کاربر (گام ۳): «من بهت گفتم وقتی فیلتر اعمال میشه روی محصولات پجینشین رو
 *                بردار نه کلا بچینشینی رو برداری خوب الا بر فرض 300 پست هست
 *                کاربر چطوری بره بقیه رو ببینه... پجینشین رو بیار دوباره»
 *
 * با 24 محصول در هر صفحه:
 *  - pagination کار می‌کنه (350 محصول → ۱۵ صفحه)
 *  - وقتی فیلتر فعال باشه، ProductCards کل محصولات رو fetch می‌کنه (interleave=0)
 *    و همه نتایج فیلترشده رو بدون pagination نمایش میده
 */
const PRODUCTS_PER_PAGE = 24;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<BotMeta | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // v1.0.1.0: state برای حالت فیلتر — وقتی فیلتر فعال است،
  // کل محصولات (نه فقط صفحه فعلی) fetch می‌شن تا فیلتر روی همه اعمال بشه
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allFetched, setAllFetched] = useState(false);

  const fetchProducts = useCallback(async (p?: number) => {
    const targetPage = p ?? page;
    setLoading(true);
    setError(null);
    setMeta(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(targetPage));
      params.set("limit", String(PRODUCTS_PER_PAGE));

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mapped: Product[] = (data.products || []).map(mapApiProduct);
      setProducts(mapped);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);

      // v5.12: Store metadata for better UX
      if (data._meta) {
        setMeta(data._meta);
        if (data._meta.connectionError) {
          setError(data._meta.error || "ربات در دسترس نیست");
        }
      }
    } catch (e: any) {
      setError(e.message || "خطا در دریافت محصولات");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const goToPage = useCallback((p: number) => {
    if (p < 1 || p > totalPages) return;
    fetchProducts(p);
  }, [totalPages, fetchProducts]);

  /**
   * v1.0.2.0: fetch همه محصولات برای حالت فیلتر (با interleave=0)
   *
   * کاربر (گام ۳): «وقتی فیلتر اعمال میشه... پجنیشین رو بردار»
   *
   * این تابع با پارامتر interleave=0 از API درخواست می‌کنه تا بات همه محصولات رو
   * (مرتب بر اساس تاریخ، بدون interleave و بدون cap کانال) برگردونه.
   * سپس فیلتر سمت کلاینت روی همه اعمال میشه و همه نتایج بدون pagination نمایش داده میشن.
   *
   * نکته: limit=500 برای پوشش دادن ~350 محصول DB کافیه. اگه DB بزرگ‌تر شد،
   * این عدد قابل افزایش هست.
   */
  const fetchAllForFilter = useCallback(async () => {
    if (allFetched || allLoading) return;
    setAllLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "500");
      // v1.0.2.0: interleave=0 → حالت raw (همه محصولات، بدون cap کانال)
      params.set("interleave", "0");
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mapped: Product[] = (data.products || []).map(mapApiProduct);
      setAllProducts(mapped);
      setAllFetched(true);
    } catch (e: any) {
      // در صورت خطا، state فعلی نگه داشته میشه
      console.error("fetchAllForFilter error:", e.message);
    } finally {
      setAllLoading(false);
    }
  }, [allFetched, allLoading]);

  const resetAllForFilter = useCallback(() => {
    setAllFetched(false);
    setAllProducts([]);
  }, []);

  return {
    products,
    loading,
    error,
    meta,
    page,
    totalPages,
    total,
    setPage: goToPage,
    refetch: fetchProducts,
    // v1.0.1.0: state و تابع برای حالت فیلتر
    allProducts,
    allLoading,
    allFetched,
    fetchAllForFilter,
    resetAllForFilter,
  };
}

/**
 * v1.0.1.0: تابع mapping مشترک — هم در fetchProducts و هم در fetchAllForFilter
 * و هم در useSearchProducts استفاده میشه (ولی فعلاً فقط در این فایل).
 */
export function mapApiProduct(p: any): Product {
  return {
    id: String(p.id),
    title: p.title || "محصول",
    price: p.price != null ? Number(p.price) : null,
    oldPrice: p.oldPrice != null ? Number(p.oldPrice) : null,
    discount:
      p.oldPrice && p.price
        ? Math.round((1 - Number(p.price) / Number(p.oldPrice)) * 100) + "%"
        : null,
    badge: p.score && p.score > 0.8 ? "پیشنهاد" : null,
    shipping: "ارسال از تلگرام",
    channel: p.channelTitle || p.channelId || "",
    channelId: p.channelId || "",
    image: buildImageUrl(p.imageUrl, p.id, p.channelId),
    clothingType: p.clothingType || "",
    gender: p.gender || "",
    date: p.date || "",
    views: p.views || 0,
    link: p.link || "",
  };
}
