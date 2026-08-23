"use client";

import React from "react";
import { useSearchProducts } from "@/hook/useSearchProducts";
import { useProducts } from "@/hook/useProducts";
import { ProductCard } from "./card/ProductCard";
import { LoadingSkeleton } from "./card/LoadingSkeleton";
import { BotStatusBadge } from "./card/BotStatusBadge";
import { EmptyState } from "./card/EmptyState";
import { Pagination } from "./Pagination";

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

  const gridRef = React.useRef<HTMLDivElement>(null);

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
        subtitle={searchHint}
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
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResults.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
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
            onClick={refetch}
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
            onClick={refetch}
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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
      />
    </div>
  );
}