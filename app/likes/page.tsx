"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore, type Product } from "@/hook/useStore";
import { formatPrice } from "@/lib/utils";
import { useDocumentTitle } from "@/hook/useDocumentTitle";

export default function LikesPage() {
  const { likes } = useStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // v1.0.0.7: عنوان داینامیک تب مرورگر
  useDocumentTitle(likes.length > 0 ? `علاقه‌مندی‌ها (${likes.length}) | کالاکو` : "علاقه‌مندی‌ها | کالاکو");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setAllProducts(d.products || []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const liked = allProducts.filter((p) => likes.includes(p.id));

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <h1 className="text-2xl font-bold text-kalako-navy mb-8">{"علاقه‌مندی‌ها ("}{likes.length}{")"}</h1>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
                <div className="bg-kalako-slate-100 aspect-square" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-kalako-slate-100 rounded w-3/4" />
                  <div className="h-5 bg-kalako-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : liked.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-kalako-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
            <p className="text-kalako-slate-500 mb-4">هنوز محصولی لایک نکردی</p>
            <Link href="/" className="text-kalako-orange font-medium hover:underline">بگرد به صفحه اصلی</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {liked.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="bg-kalako-slate-100 rounded-xl mb-3 aspect-square overflow-hidden">
                  {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-contain" />}
                </div>
                <h3 className="text-sm font-semibold text-kalako-navy mb-2 line-clamp-2">{p.title}</h3>
                <span className="text-sm font-bold text-kalako-orange">{formatPrice(p.price)} تومان</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}