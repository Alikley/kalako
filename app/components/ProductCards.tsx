"use client";

import { useEffect } from "react";
import { useStore } from "@/hook/useStore";
import { useSearchProducts } from "@/hook/useSearchProducts";
import { useProducts } from "@/hook/useProducts";
import { ProductCard } from "./product/ProductCard";
import { LoadingSkeleton } from "./product/LoadingSkeleton";
import { BotStatusBadge } from "./product/BotStatusBadge";
import { EmptyState } from "./product/EmptyState";

export function ProductCards() {
  const { products, loading, error, meta, refetch } = useProducts();
  const {
    products: searchResults,
    loading: searchLoading,
    error: searchError,
    hint: searchHint,
    searchMode,
    searchQuery,
    search,
    reset,
  } = useSearchProducts();

  useEffect(() => {
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
        title={searchError}
        hint={searchHint}
        actionLabel="بازگشت به محصولات"
        onAction={reset}
        secondaryLabel="تلاش مجدد"
        onSecondary={() => search(searchQuery)}
        icon="warning"
      />
    );
  }

  if (searchMode) {
    if (searchResults.length === 0) {
      return (
        <EmptyState
          title={`نتیجه‌ای برای «${searchQuery}» پیدا نشد`}
          description="جستجو در کانال‌های تلگرام انجام شد ولی محصولی یافت نشد"
          actionLabel="بازگشت به محصولات"
          onAction={reset}
          icon="search"
        />
      );
    }
    return (
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResults.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <EmptyState
        title="خطا در دریافت محصولات از ربات"
        description={error}
        actionLabel="تلاش مجدد"
        onAction={refetch}
        icon="warning"
        showBotStatus={<BotStatusBadge meta={meta} />}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="محصولی یافت نشد"
        description={meta?.botError ? "جستجوی تلگرام با خطا مواجه شد. دوباره تلاش کنید." : "ربات در حال شروع به کار است. چند ثانیه دیگر دوباره تلاش کنید."}
        actionLabel="تلاش مجدد"
        onAction={refetch}
        icon="search"
        showBotStatus={<BotStatusBadge meta={meta} />}
      />
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <BotStatusBadge meta={meta} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}