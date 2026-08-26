"use client";

import { useState, useCallback, useMemo } from "react";
import type { Product } from "./useStore";
import { useDocumentTitle } from "./useDocumentTitle";
import { mapApiProduct } from "./useProducts";

/**
 * v1.0.1.0: افزایش SEARCH_PAGE_SIZE از 20 به 50
 * - نتایج سرچ وب حداکثر 50 محصول است (WEB_SEARCH_LIMIT در بات)
 * - با 50، همه نتایج در یک صفحه قرار می‌گیرن و فیلتر روی همه اعمال میشه
 * - pagination فقط وقتی نمایش داده میشه که نتایج بیشتر از 50 باشن (نادر)
 *
 * v1.0.3.0: رفع باگ سینتکسی نسخه قبل — خط «const int, setHint]» خراب بود
 * (ارور tsc) و به «const [hint, setHint]» اصلاح شد.
 */
const SEARCH_PAGE_SIZE = 50;

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
        const mapped: Product[] = (data.products || []).map(mapApiProduct);
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
