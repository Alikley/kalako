"use client";

import { useState, useEffect, useCallback } from "react";

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

interface ProductsResponse {
  products: Product[];
  total: number;
  error?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const data: ProductsResponse = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      setError("خطا در بارگذاری محصولات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getImageUrl = useCallback(
    (product: Product) => {
      if (!product.hasPhoto) return null;
      const parts = product.id.split("_");
      const channelId = parts[0];
      const postId = parts.slice(1).join("_");
      return `/api/image/${channelId}/${postId}`;
    },
    []
  );

  return { products, total, loading, error, refetch: fetchProducts, getImageUrl };
}
