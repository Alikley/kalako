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
 * v1.0.4.0: حالت دسته‌بندی حذف شد — دسته‌بندی‌ها حالا «سرچ گروهی» هستن
 *
 * کاربر: «میخوام دسته بندی ها وصل نباشه به محصولاتی که در صفحه اصلی نشون
 *         میدی... وقتی کاربر زد مثلا پوشاک یه جست جو باشه نه از دیتابیس
 *         صفحه اصلی وصل باشه به دیتابیس سرچ»
 *
 *  - category/setCategory/clearCategory و پارامتر cat حذف شدن — نمای
 *    دسته‌بندی حالا از مسیر useSearchProducts (/api/search — سرچ گروهی بات)
 *    جواب می‌گیره (ProductCards این کار رو انجام میده)
 *  - fetchAllForFilter فقط برای حالت فیلتر صفحه اصلی (بدون دسته) کار میکنه
 *
 * v1.0.2.0: PRODUCTS_PER_PAGE = 24 (pagination حالت عادی)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = useCallback((p: number) => {
    if (p < 1 || p > totalPages) return;
    fetchProducts(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, fetchProducts]);

  /**
   * v1.0.2.0: fetch همه محصولات برای حالت فیلتر (با interleave=0)
   *
   * کاربر (گام ۳): «وقتی فیلتر اعمال میشه... پجنیشین رو بردار»
   *
   * v1.0.4.0: پارامتر cat حذف شد — داخل دسته‌بندی فیلترها روی نتایج سرچ
   * گروهی اعمال میشن (سمت کلاینت)، نه روی DB محصولات.
   */
  const fetchAllForFilter = useCallback(async () => {
    if (allFetched || allLoading) return;
    setAllLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "1000");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
