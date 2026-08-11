"use client";

import { useState, useCallback } from "react";
import type { Product } from "./useStore";

export function useSearchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) return;
    setLoading(true);
    setError(null);
    setHint(null);
    setSearchMode(true);
    setSearchQuery(query);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();

      // v5.12: Handle error info from bot
      if (data.error && (!data.products || data.products.length === 0)) {
        setError(data.error);
        setHint(data.hint || null);
        setProducts([]);
      } else {
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
      }
    } catch (e: any) {
      setError(e.message || "خطا در جستجو");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProducts([]);
    setSearchMode(false);
    setSearchQuery("");
    setError(null);
    setHint(null);
  }, []);

  return { products, loading, error, hint, searchMode, searchQuery, search, reset };
}
