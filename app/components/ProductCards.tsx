"use client";

import React from "react";
import { useSearchProducts } from "@/hook/useSearchProducts";
import { useProducts } from "@/hook/useProducts";
import { useFilterStore } from "@/hook/useFilterStore";
import {
  applyProductFilters,
  hasActiveFilters,
} from "@/lib/productFilters";
import { isGroupTitle } from "@/lib/categoryGroups";
import { ProductCard } from "./card/ProductCard";
import { LoadingSkeleton } from "./card/LoadingSkeleton";
import { BotStatusBadge } from "./card/BotStatusBadge";
import { EmptyState } from "./card/EmptyState";
import { Pagination } from "./Pagination";

/**
 * v1.0.3.0: حالت دسته‌بندی (category view)
 *
 * کاربر: «میخوام وقتی کاربر روی دسته بندی ها کلیک کرد... اون چیزی که های هست
 *         رو پیدا کن و نشون بده و هرکدوم گزینه دست بندی 200 تا پست»
 *
 *  - کلیک روی یکی از ۷ گروه توی نوبار → /?cat=<گروه> → این کامپوننت پارامتر
 *    رو می‌خونه و حالت دسته‌بندی رو فعال میکنه
 *  - محصولات گروه با cap ‏200 پست از API میاد (فیلتر سمت سرور route)
 *  - pagination فعال هست (24 در صفحه) — چون فیلتر باکس اعمال نشده
 *  - وقتی فیلتر باکس فعال بشه → کل محصولات دسته fetch میشه و همه نتایج
 *    فیلترشده بدون pagination نمایش داده میشن (قانون گام ۳ از v1.0.2.0)
 *  - باکس فیلتر هم فقط گزینه‌های همون گروه رو نشون میده (activeCategoryGroup
 *    در useFilterStore ست میشه)
 *
 * v1.0.2.0: حالت فیلتر — بدون pagination محلی
 * - وقتی فیلتر فعال باشه، همه نتایج فیلترشده در یک صفحه نمایش داده میشن
 * - pagination فقط در حالت عادی (بدون فیلتر) کار می‌کنه
 * - fetchAllForFilter با interleave=0 همه محصولات رو می‌گیره
 */

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
        از {total.toLocaleString("fa-IR")} محصول
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

/** v1.0.3.0: هدر حالت دسته‌بندی — عنوان گروه + دکمه بازگشت */
function CategoryHeader({
  title,
  onClear,
}: {
  title: string;
  onClear: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-kalako-slate-200 bg-kalako-cream px-4 py-3">
      <h2 className="text-base font-bold text-kalako-navy">
        دسته‌بندی: <span className="text-kalako-orange">{title}</span>
      </h2>
      <button
        onClick={onClear}
        className="text-[13px] font-bold text-kalako-navy/70 hover:text-kalako-navy transition-colors"
      >
        ← بازگشت به همه محصولات
      </button>
    </div>
  );
}

export function ProductCards() {
  const {
    products,
    loading,
    error,
    meta,
    page,
    totalPages,
    total,
    setPage,
    refetch,
    category,
    setCategory,
    clearCategory,
    allProducts,
    allLoading,
    allFetched,
    fetchAllForFilter,
    resetAllForFilter,
  } = useProducts();
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
  const category1 = useFilterStore((s) => s.category);
  const gender = useFilterStore((s) => s.gender);
  const priceRange = useFilterStore((s) => s.priceRange);
  const colors = useFilterStore((s) => s.colors);
  const resetFilters = useFilterStore((s) => s.reset);
  const setActiveCategoryGroup = useFilterStore((s) => s.setActiveCategoryGroup);
  const filtering = hasActiveFilters({ category: category1, gender, priceRange, colors });

  const gridRef = React.useRef<HTMLDivElement>(null);

  // v1.0.3.0: خواندن query param `cat` از URL → فعال کردن حالت دسته‌بندی
  // کلیک روی گروه‌های نوبار به /?cat=<گروه> میره (hard navigation تا state
  // فیلتر/سرچ قبلی ریست بشه)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat && isGroupTitle(cat)) {
      setCategory(cat);
      setActiveCategoryGroup(cat);
      // پاک کردن query param از URL تا رفرش مجدد دوباره fetch نکنه
      // (state دسته‌بندی حفظ میشه)
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("cat");
        window.history.replaceState({}, "", url.toString());
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // v1.0.2.0: حالت فیلتر بدون pagination محلی هست (همه نتایج در یک صفحه)
  // وقتی فیلتر فعال است (no-search mode)، کل محصولات رو fetch کن
  // تا فیلتر روی همه اعمال بشه (نه فقط صفحه فعلی)
  // v1.0.3.0: داخل حالت دسته‌بندی هم fetchAllForFilter با cat=<گروه> کار میکنه
  React.useEffect(() => {
    if (filtering && !searchMode && !allFetched && !allLoading) {
      fetchAllForFilter();
    }
    // وقتی فیلتر غیرفعال شد، state محلی ریست بشه تا دفعه بعد دوباره fetch کنه
    if (!filtering && allFetched) {
      resetAllForFilter();
    }
  }, [filtering, searchMode, allFetched, allLoading, fetchAllForFilter, resetAllForFilter]);

  // v1.0.2.0: اعمال فیلتر روی کل محصولات (حالت no-search + filtering)
  // همه نتایج فیلترشده بدون pagination نمایش داده میشن
  const filteredAllProducts = React.useMemo(
    () => applyProductFilters(allProducts, { category: category1, gender, priceRange, colors }),
    [allProducts, category1, gender, priceRange, colors]
  );

  // v1.0.0.9: اعمال فیلتر روی نتایج جستجو
  const filteredSearchResults = React.useMemo(
    () => applyProductFilters(searchResults, { category: category1, gender, priceRange, colors }),
    [searchResults, category1, gender, priceRange, colors]
  );

  const handlePageChange = React.useCallback((p: number) => {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [setPage]);

  const handleSearchPageChange = React.useCallback((p: number) => {
    goToSearchPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [goToSearchPage]);

  // v1.0.3.0: خروج از دسته‌بندی — گروه رو از استور فیلتر هم پاک کن
  const handleClearCategory = React.useCallback(() => {
    clearCategory();
    setActiveCategoryGroup("");
    resetAllForFilter();
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [clearCategory, setActiveCategoryGroup, resetAllForFilter]);

  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.query) {
        search(e.detail.query);
      }
    };
    window.addEventListener("kalako:search", handler);
    return () => window.removeEventListener("kalako:search", handler);
  }, [search]);

  // v1.0.1.0: خواندن query param `q` از URL و اجرای سرچ
  // وقتی کاربر روی دسته/برند در نوبار کلیک می‌کنه، به /?q=<value> می‌ره
  // و این useEffect آن را می‌خواند و سرچ می‌کند.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q && q.trim().length >= 2) {
      search(q.trim());
      // پاک کردن query param از URL تا رفرش مجدد سرچ نکنه
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("q");
        window.history.replaceState({}, "", url.toString());
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (products.length === 0 && !category) {
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

  // v1.0.2.0: حالت no-search + filtering — بدون pagination
  // فیلتر روی کل محصولات (allProducts با interleave=0) اعمال میشه
  // همه نتایج فیلترشده در یک صفحه نمایش داده میشن (کاربر: «وقتی فیلتر اعمال
  // میشه روی محصولات پجینشین رو بردار»)
  // v1.0.3.0: داخل دسته‌بندی هم همین قانون (allProducts = کل دسته)
  if (filtering) {
    if (allLoading && allProducts.length === 0) {
      return <LoadingSkeleton />;
    }
    return (
      <div className="flex-1 min-w-0">
        <div ref={gridRef} />
        <BotStatusBadge meta={meta} />
        {category && (
          <CategoryHeader title={category} onClear={handleClearCategory} />
        )}
        <FilterStatusBar
          shown={filteredAllProducts.length}
          total={allProducts.length}
          onReset={resetFilters}
        />
        {filteredAllProducts.length === 0 ? (
          allProducts.length === 0 ? (
            <EmptyState
              icon="info"
              title="در این دسته‌بندی محصولی پیدا نشد"
              subtitle="ربات هنوز داره محصولات این دسته رو جمع می‌کنه. کمی بعد دوباره تلاش کنید."
              actions={
                <button
                  onClick={handleClearCategory}
                  className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
                >
                  {"بازگشت به همه محصولات"}
                </button>
              }
            />
          ) : (
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
          )
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAllProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {/* v1.0.2.0: pagination در حالت فیلتر حذف شد — همه نتایج در یک صفحه */}
      </div>
    );
  }

  // حالت no-search + no-filtering — عادی یا دسته‌بندی (v1.0.3.0)
  // هر دو با pagination (کاربر گام ۳ قبلی: «پجینشین رو بیار دوباره»)
  return (
    <div className="flex-1 min-w-0">
      <div ref={gridRef} />
      <BotStatusBadge meta={meta} />
      {category && (
        <CategoryHeader title={category} onClear={handleClearCategory} />
      )}
      {products.length === 0 && category ? (
        <EmptyState
          icon="info"
          title="در این دسته‌بندی محصولی پیدا نشد"
          subtitle="ربات هنوز داره محصولات این دسته رو جمع می‌کنه. کمی بعد دوباره تلاش کنید."
          actions={
            <button
              onClick={handleClearCategory}
              className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
            >
              {"بازگشت به همه محصولات"}
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
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
