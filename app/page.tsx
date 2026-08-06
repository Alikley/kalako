"use client";

import React from "react";
import { HeroSection } from "./components/banner/HeroSection";
import { FilterSidebar } from "./components/card/FilterSidebar";
import { ProductCards } from "./components/card/ProductCards";
import { useSearchProducts } from "@/hook/useSearchProducts";

export default function Home() {
  const {
    products,
    total,
    loading,
    error,
    searchMode,
    searchQuery,
    search,
    resetToHome,
    getImageUrl,
  } = useSearchProducts();

  const totalFormatted = total.toLocaleString("fa-IR");

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection onSearch={search} searchLoading={loading && searchMode} />

      <section className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-kalako-navy">
              {searchMode
                ? `${totalFormatted} نتیجه برای «${searchQuery}»`
                : `${totalFormatted} محصول برای شما`}
            </h2>
            {searchMode && (
              <button
                onClick={resetToHome}
                className="text-sm text-kalako-orange hover:text-kalako-orange-hover font-medium flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                پاک کردن جستجو
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <ProductCards
              products={products}
              loading={loading}
              error={error}
              searchMode={searchMode}
              searchQuery={searchQuery}
              getImageUrl={getImageUrl}
              onReset={resetToHome}
            />
            <FilterSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
