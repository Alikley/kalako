"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BRANDS } from "@/hook/useStore";
import type { Product } from "@/hook/useStore";

function BrandProducts({ brand }: { brand: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?brand=${encodeURIComponent(brand)}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [brand]);

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
        <p className="text-kalako-slate-500">محصولی برای این برند یافت نشد</p>
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

function BrandsContent() {
  const params = useSearchParams();
  const brand = params.get("b");

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {!brand ? (
          <div>
            <h1 className="text-2xl font-bold text-kalako-navy mb-6">برندها</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {BRANDS.map((b) => (
                <a
                  key={b}
                  href={`/brands?b=${encodeURIComponent(b)}`}
                  className="bg-kalako-cream hover:bg-kalako-orange/10 rounded-2xl p-5 text-center font-medium text-kalako-navy hover:text-kalako-orange transition-colors"
                >
                  {b}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-kalako-navy">{brand}</h1>
              <a href="/brands" className="text-sm text-kalako-orange hover:underline">
                همه برندها
              </a>
            </div>
            <BrandProducts brand={brand} />
          </>
        )}
      </div>
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense>
      <BrandsContent />
    </Suspense>
  );
}