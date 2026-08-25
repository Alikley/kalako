"use client";

import React from "react";
import { useSearchProducts } from "@/hook/useSearchProducts";
import { useProducts } from "@/hook/useProducts";
import { useFilterStore } from "@/hook/useFilterStore";
import {
  applyProductFilters,
  hasActiveFilters,
} from "@/lib/productFilters";
import { ProductCard } from "./card/ProductCard";
import { LoadingSkeleton } from "./card/LoadingSkeleton";
import { BotStatusBadge } from "./card/BotStatusBadge";
import { EmptyState } from "./card/EmptyState";
import { Pagination } from "./Pagination";

/** v1.0.0.9: نوار وضعیت فیلتر — چند محصول بعد از فیلتر مانده + دکمه حذف */
function FilterStatusBar({
  shown,
  total,
  onReset,
}: {
  shown: number;
  total: number;
  onReset: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-kalako-orange/30 bg-amber-50 px-4 py-2.5">
      <p className="text-[13px] font-medium text-kalako-navy">
        نمایش{" "}
        <span className="font-bold text-kalako-orange">
          {shown.toLocaleString("fa-IR")}
        </span>{" "}
        از {total.toLocaleString("fa-IR")} محصول در این صفحه
      </p>
      <button
        onClick={onReset}
        className="text-[13px] font-bold text-kalako-orange hover:text-kalako-orange-hover transition-colors"
      >
        حذف فیلترها
      </button>
    </div>
  );
}

export function ProductCards() {
  const { products, loading, error, meta, page, totalPages, total, setPage, refetch } = useProducts();
  const {
    products: searchResults,
    loading: searchLoading,
    error: searchError,
    hint: searchHint,
    searchMode,
    searchQuery,
    search,
    reset,
    searchPage,
    searchTotalPages,
    searchTotal,
    goToSearchPage,
  } = useSearchProducts();

  // v1.0.0.9: فیلترهای سایدبار از استور مشترک
  // (selectorهای جداگانه — در zustand v5 برگرداندن آبجکت جدید از selector یکجا = loop رندر)
  const category = useFilterStore((s) => s.category);
  const gender = useFilterStore((s) => s.gender);
  const priceRange = useFilterStore((s) => s.priceRange);
  const colors = useFilterStore((s) => s.colors);
  const resetFilters = useFilterStore((s) => s.reset);
  const filtering = hasActiveFilters({ category, gender, priceRange, colors });

  const gridRef = React.useRef<HTMLDivElement>(null);

  // v1.0.0.9: اعمال فیلتر روی محصولات صفحه فعلی (لیست عادی)
  const filteredProducts = React.useMemo(
    () => applyProductFilters(products, { category, gender, priceRange, colors }),
    [products, category, gender, priceRange, colors]
  );

  // v1.0.0.9: اعمال فیلتر روی نتایج جستجو
  const filteredSearchResults = React.useMemo(
    () => applyProductFilters(searchResults, { category, gender, priceRange, colors }),
    [searchResults, category, gender, priceRange, colors]
  );

  const handlePageChange = React.useCallback((p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [setPage]);

  const handleSearchPageChange = React.useCallback((p: number) => {
    goToSearchPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [goToSearchPage]);

  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.query) {
        search(e.detail.query);
      }
    };
    window.addEventListener("kalako:search", handler);
    return () => window.removeEventListener("kalako:search", handler);
  }, [search]);

  if (searchLoading) return <LoadingSkeleton />;

  if (searchError) {
    return (
      <EmptyState
        icon="warning"
        title={searchError}
        subtitle={searchHint || undefined}
        actions={
          <>
            <button
              onClick={reset}
              className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
            >
              {"بازگشت به محصولات"}
            </button>
            <button
              onClick={() => search(searchQuery)}
              className="text-kalako-navy hover:text-kalako-navy-light text-sm font-medium"
            >
              {"تلاش مجدد"}
            </button>
          </>
        }
      />
    );
  }

  if (searchMode) {
    if (searchResults.length === 0) {
      return (
        <EmptyState
          icon="search"
          title={`نتیجه‌ای برای «${searchQuery}» پیدا نشد`}
          subtitle="جستجوی مستقیم تلگرام انجام شد ولی محصولی یافت نشد"
          actions={
            <button
              onClick={reset}
              className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
            >
              {"بازگشت به محصولات"}
            </button>
          }
        />
      );
    }
    return (
      <div className="flex-1 min-w-0">
        <div ref={gridRef} />
        {filtering && <FilterStatusBar
          shown={filteredSearchResults.length}
          total={searchResults.length}
          onReset={resetFilters}
        />}
        {filteredSearchResults.length === 0 ? (
          <EmptyState
            icon="filter"
            title="با این فیلترها محصولی پیدا نشد"
            subtitle="فیلترها را تغییر دهید یا حذف کنید"
            actions={
              <button
                onClick={resetFilters}
                className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
              >
                {"حذف فیلترها"}
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSearchResults.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <Pagination
          page={searchPage}
          totalPages={searchTotalPages}
          total={searchTotal}
          onPageChange={handleSearchPageChange}
        />
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon="warning"
        title="خطا در دریافت محصولات از ربات"
        subtitle={error}
        meta={meta}
        actions={
          <button
            onClick={() => refetch()}
            className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
          >
            {"تلاش مجدد"}
          </button>
        }
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="info"
        title="محصولی یافت نشد"
        subtitle={
          meta?.botError
            ? "جستجوی تلگرام با خطا مواجه شد. دوباره تلاش کنید."
            : "ربات در حال شروع به کار است. چند ثانیه دیگر دوباره تلاش کنید."
        }
        meta={meta}
        actions={
          <button
            onClick={() => refetch()}
            className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
          >
            {"تلاش مجدد"}
          </button>
        }
      />
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <div ref={gridRef} />
      <BotStatusBadge meta={meta} />
      {filtering && <FilterStatusBar
        shown={filteredProducts.length}
        total={products.length}
        onReset={resetFilters}
      />}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon="filter"
          title="با این فیلترها محصولی پیدا نشد"
          subtitle="فیلترها را تغییر دهید یا حذف کنید"
          actions={
            <button
              onClick={resetFilters}
              className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
            >
              {"حذف فیلترها"}
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
