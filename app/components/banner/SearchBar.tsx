"use client";

import React, { useState, useRef } from "react";

const QUICK_TAGS = [
  "تی‌شرت مردانه",
  "هودی",
  "شلوار جین",
  "کتونی نایکی",
  "کفش زنانه",
];

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (query.trim().length >= 2 && !loading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    if (!loading) {
      onSearch(tag);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center bg-white rounded-[24px] p-2 pr-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgb(251,146,60,0.15)] focus-within:ring-2 focus-within:ring-amber-200">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="عنوان کالا یا برند را وارد کنید"
          className="flex-1 bg-transparent outline-none text-kalako-navy text-lg placeholder:text-kalako-slate-400 py-3 px-3"
          dir="rtl"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || query.trim().length < 2}
          className="bg-kalako-orange hover:bg-kalako-orange-hover disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-[18px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 mr-2"
        >
          {loading ? (
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-xs text-kalako-slate-500 font-medium ml-1">
          محبوب‌ترین سرچ‌ها:
        </span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            disabled={loading}
            className="px-5 py-2 bg-white/90 border border-gray-100 rounded-full text-sm text-kalako-slate-600 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-50 transition-all duration-200 shadow-sm"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}