"use client";

import { useState, useCallback } from "react";
import type { Product } from "./useProducts";

interface SearchResponse {
  products: Product[];
  total: number;
  query: string;
  error?: string;
}

export function useSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const search = useCallback(async (
    searchQuery: string,
    options?: { gender?: string; priceMin?: number; priceMax?: number }
  ) => {
    if (!searchQuery || searchQuery.trim().length < 2) return;

    const trimmed = searchQuery.trim();
    setQuery(trimmed);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          gender: options?.gender,
          priceMin: options?.priceMin,
          priceMax: options?.priceMax,
        }),
      });
      const data: SearchResponse = await res.json();

      if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setResults(data.products || []);
        setTotal(data.total || 0);
      }
    } catch {
      setError("خطا در جستجو");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setTotal(0);
    setQuery("");
    setError(null);
  }, []);

  return { results, total, loading, error, query, search, clear };
}
