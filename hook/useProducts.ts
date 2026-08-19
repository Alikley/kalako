"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "./useStore";

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

const PRODUCTS_PER_PAGE = 20;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<BotMeta | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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
      const mapped: Product[] = (data.products || []).map((p: any) => ({
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
        image: p.imageUrl || `/api/image/${encodeURIComponent(p.channelId || "")}/${String(p.id).split("_")[1] || 0}`,
        date: p.date || "",
        views: p.views || 0,
        link: p.link || "",
      }));
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

  return { products, loading, error, meta, page, totalPages, total, setPage: goToPage, refetch: fetchProducts };
}
