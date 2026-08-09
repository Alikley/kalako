"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "./useStore";

const BOT_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:3001";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BOT_URL}/api/products`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const mapped: Product[] = (data.products || []).map((p: any) => ({
        id: p.id,
        title: p.title || "\u0645حص\u0648\u0644",
        price: p.price,
        oldPrice: p.oldPrice || null,
        discount: p.oldPrice && p.price ? Math.round((1 - Number(p.price) / Number(p.oldPrice)) * 100) + "%" : p.discount || null,
        badge: p.score && p.score > 0.8 ? "\u067e\u06cc\u0634\u0646\u0647\u0627\u062f" : null,
        shipping: "\u0627\u0631\u0633\u0627\u0644 \u0627\u0632 \u062a\u0644\u06af\u0631\u0627\u0645",
        channel: p.channelTitle || p.channelId || "",
        channelId: p.channelId || "",
        image: p.imageUrl || `${BOT_URL}/api/image/${encodeURIComponent(p.channelId || "")}/${p.id?.toString().split("_")[1] || 0}`,
        date: p.date || "",
        views: p.views || 0,
        link: p.link || "",
      }));
      setProducts(mapped);
    } catch (e: any) {
      setError(e.message || "\u062e\u0637\u0627 \u062f\u0631 \u062f\u0631\u06cc\u0627\u0641\u062a \u0645\u062d\u0635\u0648\u0644\u0627\u062a");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
