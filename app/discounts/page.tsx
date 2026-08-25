"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/hook/useStore";
import type { Product } from "@/hook/useStore";
import { formatPrice } from "@/lib/utils";
import { useDocumentTitle } from "@/hook/useDocumentTitle";

function DiscountProducts({ cat }: { cat: string | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = cat
      ? `/api/products?discount=true&cat=${encodeURIComponent(cat)}`
      : `/api/products?discount=true`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [cat]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="bg-kalako-slate-100 aspect-[3/4]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-kalako-slate-100 rounded w-3/4" />
              <div className="h-5 bg-kalako-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-kalako-slate-500">تخفیفی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-kalako-slate-100 aspect-[3/4]">
            {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-contain" />}
          </div>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-kalako-navy line-clamp-2">{p.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm font-bold text-kalako-orange">{formatPrice(p.price)}</p>
              {p.oldPrice && (
                <p className="text-xs text-kalako-slate-400 line-through">{formatPrice(p.oldPrice)}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiscountsContent() {
  const params = useSearchParams();
  const cat = params.get("cat");

  // v1.0.0.7: عنوان داینامیک تب مرورگر
  useDocumentTitle(cat ? `تخفیف ${cat} | کالاکو` : "تخفیف‌ها | کالاکو");

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {!cat ? (
          <div>
            <h1 className="text-2xl font-bold text-kalako-navy mb-6">تخفیف‌ها</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((c) => (
                <a key={c} href={`/discounts?cat=${encodeURIComponent(c)}`} className="bg-kalako-red-light hover:bg-kalako-red/20 rounded-2xl p-6 text-center transition-colors">
                  <span className="text-kalako-red font-bold text-sm">{c}</span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-kalako-navy">{"تخفیف "}{cat}</h1>
              <a href="/discounts" className="text-sm text-kalako-orange hover:underline">همه تخفیف‌ها</a>
            </div>
            <DiscountProducts cat={cat} />
          </>
        )}
      </div>
    </div>
  );
}

export default function DiscountsPage() {
  return <Suspense><DiscountsContent /></Suspense>;
}