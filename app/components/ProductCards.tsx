"use client";

import React from "react";
import { useStore, type Product } from "@/hook/useStore";
import { useSearchProducts } from "@/hook/useSearchProducts";
import { useProducts } from "@/hook/useProducts";

function HeartIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChannelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { likes, toggleLike } = useStore();
  const isLiked = likes.includes(product.id);
  const priceFormatted = product.price
    ? product.price.toLocaleString("fa-IR")
    : null;
  const [imgError, setImgError] = React.useState(false);

  let dateStr = "";
  if (product.date) {
    try {
      dateStr = new Date(product.date).toLocaleDateString("fa-IR");
    } catch {
      dateStr = "";
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow duration-300 group">
      <div className="relative bg-[#F3F4F6] aspect-[3/4] overflow-hidden">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-kalako-slate-300">
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        <button
          onClick={() => toggleLike(product.id)}
          className={`absolute top-3 left-3 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-200 ${
            isLiked
              ? "bg-red-50 text-kalako-red"
              : "bg-white/80 text-kalako-slate-400 hover:text-kalako-red"
          }`}
          aria-label={isLiked ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
        >
          <HeartIcon className="w-4 h-4" filled={isLiked} />
        </button>

        {product.discount && (
          <span className="absolute top-3 right-3 bg-kalako-red text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
            {product.discount}
          </span>
        )}

        {(product.views ?? 0) > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-lg">
            {(product.views ?? 0).toLocaleString("fa-IR")} {"بازدید"}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-kalako-navy leading-relaxed line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5 bg-kalako-slate-100 rounded-lg px-2.5 py-1.5 self-start">
          <ChannelIcon className="w-3.5 h-3.5 text-kalako-slate-400" />
          <span className="text-[11px] text-kalako-slate-500 font-medium">
            {product.channel}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {priceFormatted ? (
            <span className="text-[15px] font-bold text-kalako-orange">
              {priceFormatted}
              <span className="text-[11px] font-normal text-kalako-slate-500 mr-1">
                {"تومان"}
              </span>
            </span>
          ) : (
            <span className="text-[13px] text-kalako-slate-400">
              {"قیمت نامشخص"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <CheckCircleIcon className="w-4 h-4 text-kalako-orange" />
          <span className="text-[11px] text-kalako-slate-500">{dateStr}</span>
        </div>

        {product.link ? (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-kalako-navy text-white text-[13px] font-medium py-2.5 rounded-xl hover:bg-kalako-navy-light transition-colors duration-200 text-center flex items-center justify-center gap-1.5"
          >
            {"مشاهده در تلگرام"}
            <ExternalLinkIcon className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="flex-1 bg-kalako-slate-200 text-kalako-slate-400 text-[13px] font-medium py-2.5 rounded-xl text-center">
            {"لینک موجود نیست"}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] animate-pulse"
        >
          <div className="bg-[#F3F4F6] aspect-[3/4]" />
          <div className="p-4 flex flex-col gap-2.5">
            <div className="h-4 bg-kalako-slate-100 rounded w-full" />
            <div className="h-3 bg-kalako-slate-100 rounded w-2/3" />
            <div className="h-5 bg-kalako-slate-100 rounded w-1/2 mt-2" />
            <div className="h-9 bg-kalako-slate-100 rounded-xl mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * v4.10: وضعیت بات — نشان میده ربات چیه
 */
function BotStatusBadge({ meta }: { meta: any }) {
  if (!meta) return null;

  if (meta.connectionError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-red-700 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="font-medium">ربات در دسترس نیست</span>
        </div>
        <p className="text-red-600 text-xs mt-1 mr-7">
          مطمئن شوید ربات clothes_bot روی پورت 3001 اجرا شده است
        </p>
      </div>
    );
  }

  if (meta.searching) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-amber-700 text-sm">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>در حال جستجو در کانال‌های تلگرام...</span>
        </div>
      </div>
    );
  }

  if (meta.botError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-amber-700 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">خطا در جستجوی تلگرام</span>
        </div>
        <p className="text-amber-600 text-xs mt-1 mr-7">
          {meta.botError}
          {meta.botHint && ` — ${meta.botHint}`}
        </p>
      </div>
    );
  }

  if (meta.stale) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2 text-blue-700 text-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>نمایش نتایج کش شده — تلگرام در حال اتصال مجدد</span>
        </div>
      </div>
    );
  }

  return null;
}

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
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="w-16 h-16 text-kalako-slate-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <p className="text-kalako-red text-sm font-medium mb-2">{searchError}</p>
        {searchHint && (
          <p className="text-kalako-slate-400 text-xs mb-4 max-w-md">{searchHint}</p>
        )}
        <div className="flex gap-3">
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
        </div>
      </div>
    );
  }

  if (searchMode) {
    if (searchResults.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <svg
            className="w-16 h-16 text-kalako-slate-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-kalako-slate-500 text-sm">
            {"نتیجه‌ای برای «"}{searchQuery}{"» پیدا نشد"}
          </p>
          <p className="text-kalako-slate-400 text-xs mt-2">
            جستجو در کانال‌های تلگرام انجام شد ولی محصولی یافت نشد
          </p>
          <button
            onClick={reset}
            className="mt-4 text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
          >
            {"بازگشت به محصولات"}
          </button>
        </div>
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
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <BotStatusBadge meta={meta} />
        <svg
          className="w-16 h-16 text-kalako-slate-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <p className="text-kalako-slate-500 text-sm mb-2">
          {"خطا در دریافت محصولات از ربات"}
        </p>
        <p className="text-kalako-slate-400 text-xs mb-4">
          {error}
        </p>
        <button
          onClick={refetch}
          className="text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
        >
          {"تلاش مجدد"}
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <BotStatusBadge meta={meta} />
        <svg
          className="w-16 h-16 text-kalako-slate-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-kalako-slate-500 text-sm">{"محصولی یافت نشد"}</p>
        <p className="text-kalako-slate-400 text-xs mt-2">
          {meta?.botError
            ? "جستجوی تلگرام با خطا مواجه شد. دوباره تلاش کنید."
            : "ربات در حال شروع به کار است. چند ثانیه دیگر دوباره تلاش کنید."}
        </p>
        <button
          onClick={refetch}
          className="mt-4 text-kalako-orange hover:text-kalako-orange-hover text-sm font-medium"
        >
          {"تلاش مجدد"}
        </button>
      </div>
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