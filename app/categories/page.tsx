"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/hook/useStore";
import { FilterSidebar } from "@/app/components/FilterSidebar";
import type { Product } from "@/hook/useStore";

function CategoryProducts({ cat }: { cat: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?cat=${encodeURIComponent(cat)}`)
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
        <p className="text-kalako-slate-500">محصولی برای این دسته‌بندی یافت نشد</p>
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
            <p className="text-sm font-bold text-kalako-orange mt-2">{p.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoriesContent() {
  const params = useSearchParams();
  const cat = params.get("cat");

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {!cat ? (
          <div>
            <h1 className="text-2xl font-bold text-kalako-navy mb-6">
              دسته‌بندی‌ها
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((c) => (
                <a
                  key={c}
                  href={`/categories?cat=${encodeURIComponent(c)}`}
                  className="bg-kalako-cream hover:bg-kalako-orange/10 rounded-2xl p-6 text-center font-medium text-kalako-navy hover:text-kalako-orange transition-colors"
                >
                  {c}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-kalako-navy">{cat}</h1>
              <a href="/categories" className="text-sm text-kalako-orange hover:underline">
                همه دسته‌بندی‌ها
              </a>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <CategoryProducts cat={cat} />
              <FilterSidebar />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesContent />
    </Suspense>
  );
}