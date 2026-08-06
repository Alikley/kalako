"use client";

import { useState, useCallback, useEffect } from "react";

export interface Product {
  id: string;
  channelId: string;
  channelTitle: string;
  title: string;
  text: string;
  price: number | null;
  score: number | null;
  date: number;
  views: number;
  hasPhoto: boolean;
  link: string;
}

interface ApiResponse {
  products: Product[];
  total: number;
  error?: string;
}

export function useSearchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const data: ApiResponse = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      }
    } catch {
      setError("خطا در بارگذاری محصولات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const search = useCallback(async (
    query: string,
    options?: { gender?: string; priceMin?: number; priceMax?: number }
  ) => {
    if (!query || query.trim().length < 2) return;

    const trimmed = query.trim();
    setSearchQuery(trimmed);
    setSearchMode(true);
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
      const data: ApiResponse & { query?: string } = await res.json();

      if (data.error) {
        setError(data.error);
        setProducts([]);
      } else {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      }
    } catch {
      setError("خطا در جستجو");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetToHome = useCallback(() => {
    setSearchMode(false);
    setSearchQuery("");
    setError(null);
    fetchProducts();
  }, [fetchProducts]);

  const getImageUrl = useCallback((product: Product) => {
    if (!product.hasPhoto) return null;
    const parts = product.id.split("_");
    const channelId = parts[0];
    const postId = parts.slice(1).join("_");
    return `/api/image/${channelId}/${postId}`;
  }, []);

  return {
    products,
    total,
    loading,
    error,
    searchMode,
    searchQuery,
    search,
    resetToHome,
    getImageUrl,
    refetch: fetchProducts,
  };
}
