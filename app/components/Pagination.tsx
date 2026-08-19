"use client";

import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

/** تبدیل عدد لاتین به فارسی */
function toFa(n: number): string {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

/** بازه اعداد صفحه رو حساب می‌کنه — حداکثر ۵ دکمه نمایشی */
function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(page, totalPages);

  return (
    <div className="flex flex-col items-center gap-3 mt-8 pb-4">
      {/* نمایش تعداد کل */}
      <span className="text-sm text-kalako-slate-500">
        {toFa(total)} {"محصول"}
      </span>

      {/* دکمه‌های صفحه‌بندی */}
      <nav className="flex items-center gap-1.5" aria-label="صفحه‌بندی">
        {/* دکمه قبلی */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-9 min-w-[36px] px-3 rounded-lg text-sm font-medium transition-colors duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-white text-kalako-navy border border-gray-200 hover:bg-gray-50
            enabled:hover:border-kalako-orange enabled:hover:text-kalako-orange"
        >
          {"قبلی"}
        </button>

        {/* شماره صفحات */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`dots-${i}`}
              className="h-9 w-9 flex items-center justify-center text-kalako-slate-400 text-sm select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors duration-200
                ${
                  p === page
                    ? "bg-kalako-orange text-white shadow-sm"
                    : "bg-white text-kalako-navy border border-gray-200 hover:bg-gray-50 hover:border-kalako-orange hover:text-kalako-orange"
                }`}
            >
              {toFa(p)}
            </button>
          )
        )}

        {/* دکمه بعدی */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-9 min-w-[36px] px-3 rounded-lg text-sm font-medium transition-colors duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-white text-kalako-navy border border-gray-200 hover:bg-gray-50
            enabled:hover:border-kalako-orange enabled:hover:text-kalako-orange"
        >
          {"بعدی"}
        </button>
      </nav>
    </div>
  );
}