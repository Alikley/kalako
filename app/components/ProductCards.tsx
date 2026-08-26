"use client";

import React from "react";
import { useSearchProducts } from "@/hook/useSearchProducts";
import { useProducts } from "@/hook/useProducts";
import { useFilterStore } from "@/hook/useFilterStore";
import {
  applyProductFilters,
  hasActiveFilters,
} from "@/lib/productFilters";
import { isGroupTitle, typesOfGroup, normalizeFa } from "@/lib/categoryGroups";
import { ProductCard } from "./card/ProductCard";
import { LoadingSkeleton } from "./card/LoadingSkeleton";
import { BotStatusBadge } from "./card/BotStatusBadge";
import { EmptyState } from "./card/EmptyState";
import { Pagination } from "./Pagination";

/**
 * v1.0.4.0: دسته‌بندی = سرچ (category-as-search)
 *
 * کاربر: «میخوام دسته بندی ها وصل نباشه به محصولاتی که در صفحه اصلی نشون
 *         میدی... وقتی کاربر زد مثلا پوشاک یه جست جو باشه نه از دیتابیس
 *         صفحه اصلی وصل باشه به دیتابیس سرچ»
 *         «میخوام هشتگ ها مستقل باشه توی صفحه اصلی اما توی دسته بندی ها
 *          کاربر وقتی زد سرچ بشه مثل سرچ»
 *
 *  - کلیک روی یکی از ۷ گروه نوبار → /?cat=<گروه> → این کامپوننت فعال‌کردن
 *    activeCategoryGroup (استور فیلتر) + اجرای «سرچ گروهی» از مسیر
 *    useSearchProducts (/api/search — مثل سرچ‌بار، DB سرچ نه DB صفحه اصلی)
 *  - داخل دسته‌بندی، انتخاب هشتگ از باکس فیلتر → سرچ همون هشتگ (مثل سرچ)؛
 *    «همه» → سرچ کل گروه
 *  - صفحه اصلی (بدون دسته): هشتگ‌های باکس فیلتر مثل قبل مستقل‌ان — فیلتر
 *    سمت کلاینت روی همه محصولات (fetchAllForFilter) — هیچ چیز عوض نشده
 *  - باکس فیلتر داخل دسته فقط گزینه‌های همون گروه رو نشون میده (همان
 *    رفتار v1.0.3.0 — activeCategoryGroup در FilterSidebar)
 *  - سرچ آزاد (سرچ‌بار / ?q=) از حالت دسته‌بندی خارج میشه (سرچ سراسریه)
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

/** v1.0.3.0+: هدر حالت دسته‌بندی — عنوان گروه + دکمه بازگشت */
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
  const activeCategoryGroup = useFilterStore((s) => s.activeCategoryGroup);
  const setActiveCategoryGroup = useFilterStore((s) => s.setActiveCategoryGroup);
  const filtering = hasActiveFilters({ category: category1, gender, priceRange, colors });

  const gridRef = React.useRef<HTMLDivElement>(null);

  // v1.0.4.0: آیا سرچ فعلی «داخل دسته‌بندی»ه؟ (سرچ = خود گروه یا یکی از
  // هشتگ‌های همون گروه) — برای نمایش CategoryHeader و حالت‌های خالی
  const inCategorySearch =
    activeCategoryGroup !== "" &&
    (searchQuery === activeCategoryGroup ||
      typesOfGroup(activeCategoryGroup).some(
        (t) => normalizeFa(t) === normalizeFa(searchQuery)
      ));

  // v1.0.4.0: خواندن query param `cat` از URL → فعال کردن حالت دسته‌بندی
  // کلیک روی گروه‌های نوبار به /?cat=<گروه> میره (hard navigation تا state
  // فیلتر/سرچ قبلی ریست بشه). خود «سرچ گروهی» توسط effect پایین انجام میشه.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (cat && isGroupTitle(cat)) {
      setActiveCategoryGroup(cat);
      // پاک کردن query param از URL تا رفرش مجدد دوباره دسته رو فعال نکنه
      // (state گروه در استور فیلتر حفظ میشه)
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

  // v1.0.4.0: موتور «دسته‌بندی = سرچ» —
  //  - ورود به دسته (activeCategoryGroup ست بشه) → سرچ گروهی
  //  - انتخاب هشتگ از باکس فیلتر داخل دسته (category1 تغییر کنه) →
  //    سرچ همون هشتگ (کاربر: «توی دسته بندی ها کاربر وقتی زد سرچ بشه
  //    مثل سرچ»)؛ «همه» → دوباره سرچ کل گروه
  //  - خروج از دسته (activeCategoryGroup="") → هیچ سرچی (بازگشت با دکمه
  //    خودش reset() رو صدا می‌زنه)
  React.useEffect(() => {
    if (!activeCategoryGroup) return;
    const target = category1 || activeCategoryGroup;
    search(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryGroup, category1]);

  // v1.0.2.0: حالت فیلتر بدون pagination محلی هست (همه نتایج در یک صفحه)
  // وقتی فیلتر فعال است (no-search mode)، کل محصولات رو fetch کن
  // تا فیلتر روی همه اعمال بشه (نه فقط صفحه فعلی)
  // v1.0.4.0: داخل دسته‌بندی این fetch انجام نمیشه — نتایج دسته از مسیر
  // سرچ میان و فیلترها سمت کلاینت روی همون نتایج اعمال میشن
  React.useEffect(() => {
    if (filtering && !searchMode && !activeCategoryGroup && !allFetched && !allLoading) {
      fetchAllForFilter();
    }
    // وقتی فیلتر غیرفعال شد، state محلی ریست بشه تا دفعه بعد دوباره fetch کنه
    if (!filtering && allFetched) {
      resetAllForFilter();
    }
  }, [filtering, searchMode, activeCategoryGroup, allFetched, allLoading, fetchAllForFilter, resetAllForFilter]);

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

  // v1.0.4.0: خروج از دسته‌بندی — خروج از سرچ + پاک کردن گروه استور +
  // ریست فیلترها + بازگشت به نمای عادی محصولات
  const handleExitCategory = React.useCallback(() => {
    setActiveCategoryGroup("");
    resetFilters();
    reset();
    resetAllForFilter();
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [setActiveCategoryGroup, resetFilters, reset, resetAllForFilter]);

  // v1.0.4.0: سرچ آزاد از سرچ‌بار = خروج از حالت دسته‌بندی (سرچ سراسریه)
  React.useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.query) {
        setActiveCategoryGroup(""); // no-op اگه دسته‌ای فعال نباشه
        search(e.detail.query);
      }
    };
    window.addEventListener("kalako:search", handler);
    return () => window.removeEventListener("kalako:search", handler);
  }, [search, setActiveCategoryGroup]);

  // v1.0.1.0: خواندن query param `q` از URL و اجرای سرچ
  // v1.0.4.0: سرچ از URL هم مثل سرچ‌بار از حالت دسته‌بندی خارج می‌کنه
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q && q.trim().length >= 2) {
      setActiveCategoryGroup("");
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
              onClick={inCategorySearch ? handleExitCategory : reset}
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
    // v1.0.4.0: حالت خالی داخل دسته‌بندی — پیام مخصوص دسته
    if (searchResults.length === 0) {
      return (
        <EmptyState
          icon="search"
          title={
            inCategorySearch
              ? `در دسته‌بندی «${activeCategoryGroup}» محصولی پیدا نشد`
              : `نتیجه‌ای برای «${searchQuery}» پیدا نشد`
          }
          subtitle="جستجوی مستقیم تلگرام انجام شد ولی محصولی یافت نشد"
          actions={
            <button
              onClick={inCategorySearch ? handleExitCategory : reset}
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
        {/* v1.0.4.0: هدر دسته‌بندی داخل نتایج سرچ گروهی */}
        {inCategorySearch && (
          <CategoryHeader title={activeCategoryGroup} onClear={handleExitCategory} />
        )}
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

  // v1.0.2.0: حالت no-search + filtering — بدون pagination
  // فیلتر روی کل محصولات (allProducts با interleave=0) اعمال میشه
  // همه نتایج فیلترشده در یک صفحه نمایش داده میشن (کاربر: «وقتی فیلتر اعمال
  // میشه روی محصولات پجینشین رو بردار»)
  if (filtering) {
    if (allLoading && allProducts.length === 0) {
      return <LoadingSkeleton />;
    }
    return (
      <div className="flex-1 min-w-0">
        <div ref={gridRef} />
        <BotStatusBadge meta={meta} />
        <FilterStatusBar
          shown={filteredAllProducts.length}
          total={allProducts.length}
          onReset={resetFilters}
        />
        {filteredAllProducts.length === 0 ? (
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
            {filteredAllProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {/* v1.0.2.0: pagination در حالت فیلتر حذف شد — همه نتایج در یک صفحه */}
      </div>
    );
  }

  // حالت no-search + no-filtering — عادی (صفحه اصلی)
  // pagination فعال (کاربر گام ۳ قبلی: «پجینشین رو بیار دوباره»)
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
