"use client";

import { useState, useCallback, useMemo } from "react";
import type { Product } from "./useStore";
import { useDocumentTitle } from "./useDocumentTitle";
import { buildImageUrl } from "../lib/postId";

const SEARCH_PAGE_SIZE = 20;

export function useSearchProducts() {
  const [allResults, setAllResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);

  const searchTotalPages = useMemo(
    () => Math.max(1, Math.ceil(allResults.length / SEARCH_PAGE_SIZE)),
    [allResults.length]
  );

  const products = useMemo(
    () => {
      const start = (searchPage - 1) * SEARCH_PAGE_SIZE;
      return allResults.slice(start, start + SEARCH_PAGE_SIZE);
    },
    [allResults, searchPage]
  );

  const searchTotal = allResults.length;

  /**
   * v1.0.0.7: عنوان داینامیک تب مرورگر بر اساس وضعیت جستجو
   *  - در حال سرچ:  «در حال جستجوی "X" | کالاکو»
   *  - با نتیجه:    «جستجوی "X" — N نتیجه | کالاکو»
   *  - بدون نتیجه:  «جستجوی "X" — نتیجه‌ای نبود | کالاکو»
   *  - حالت دیفالت: «کالاکو» (وقتی سرچی در جریان نیست)
   */
  const searchTitle = useMemo(() => {
    if (!searchMode || !searchQuery) return null;

    if (loading) {
      return `در حال جستجوی «${searchQuery}» | کالاکو`;
    }

    const count = allResults.length;
    if (count > 0) {
      const faCount = count.toLocaleString("fa-IR");
      return `جستجوی «${searchQuery}» — ${faCount} نتیجه | کالاکو`;
    }

    return `جستجوی «${searchQuery}» — نتیجه‌ای نبود | کالاکو`;
  }, [searchMode, searchQuery, loading, allResults]);

  useDocumentTitle(searchTitle);

  const goToSearchPage = useCallback((p: number) => {
    if (p >= 1 && p <= searchTotalPages) setSearchPage(p);
  }, [searchTotalPages]);

  const search = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) return;
    setLoading(true);
    setError(null);
    setHint(null);
    setSearchMode(true);
    setSearchQuery(query);
    setSearchPage(1);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();

      if (data.error && (!data.products || data.products.length === 0)) {
        setError(data.error);
        setHint(data.hint || null);
        setAllResults([]);
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
          image: buildImageUrl(p.imageUrl, p.id, p.channelId),
          date: p.date || "",
          views: p.views || 0,
          link: p.link || "",
        }));
        setAllResults(mapped);
      }
    } catch (e: any) {
      setError(e.message || "خطا در جستجو");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAllResults([]);
    setSearchMode(false);
    setSearchQuery("");
    setSearchPage(1);
    setError(null);
    setHint(null);
  }, []);

  return {
    products,
    allResults,
    loading,
    error,
    hint,
    searchMode,
    searchQuery,
    search,
    reset,
    searchPage,
    searchTotalPages,
    searchTotal,
    goToSearchPage,
  };
}
