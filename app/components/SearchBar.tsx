"use client";

import React, { useState, useEffect } from "react";

const QUICK_TAGS = [
  "تیشرت",
  "شلوار",
  "کتونی",
  "هودی",
  "کفش",
];

export function SearchBar() {
  const [query, setQuery] = useState("");

  // v1.0.1.0: خواندن query param `q` از URL و ست کردن input
  // وقتی کاربر از نوبار روی دسته/برند کلیک می‌کنه، به /?q=<value> می‌ره
  // و این useEffect آن را می‌خونه و input رو ست می‌کنه تا کاربر ببینه چی سرچ شده
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
    }
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    window.dispatchEvent(
      new CustomEvent("kalako:search", { detail: { query: query.trim() } })
    );
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center bg-white rounded-[24px] p-2 pr-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(251,146,60,0.15)] focus-within:ring-2 focus-within:ring-amber-200">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="عنوان کالا یا برند را وارد کنید"
          className="flex-1 bg-transparent outline-none text-kalako-navy text-lg placeholder:text-kalako-slate-400 py-3 px-3"
        />
        <button
          onClick={handleSearch}
          className="bg-kalako-orange hover:bg-kalako-orange-hover text-white p-4 rounded-[18px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 mr-2"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-xs text-kalako-slate-500 font-medium ml-1">
          محبوب‌ترین سرچ‌ها:
        </span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setQuery(tag);
              window.dispatchEvent(
                new CustomEvent("kalako:search", { detail: { query: tag } })
              );
            }}
            className="px-5 py-2 bg-white/90 border border-gray-100 rounded-full text-sm text-kalako-slate-600 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
