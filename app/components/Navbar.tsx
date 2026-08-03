"use client";

import React, { useState } from "react";
import { KalakoLogo } from "./KalakoLogo";

/* ── آیتم‌های منوی اصلی ── */
const NAV_ITEMS = [
  { label: "خانه", href: "#", active: true },
  { label: "دسته‌بندی‌ها", href: "#categories" },
  { label: "برندها", href: "#brands" },
  { label: "تخفیف‌ها", href: "#discounts" },
  { label: "درباره ما", href: "#about" },
  { label: "تماس", href: "#contact" },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];

/* ══════════════════════════════════════════
   NavbarItem — هر آیتم منو (دسکتاپ)
   ══════════════════════════════════════════ */
function NavbarItem({ item }: { item: NavItem }) {
  return (
    <a
      href={item.href}
      className={`relative py-2 text-sm font-medium transition-colors duration-200 hover:text-kalako-navy-light
        ${item.active ? "text-kalako-navy" : "text-kalako-slate-500"}`}
    >
      {item.label}
      {/* نوار نارنجی زیر آیتم فعال */}
      {item.active && (
        <span className="absolute bottom-0 right-0 left-0 h-[3px] rounded-full bg-kalako-orange" />
      )}
    </a>
  );
}

/* ══════════════════════════════════════════
   MobileMenu — منوی موبایل (بدون Sheet — فقط Tailwind)
   ══════════════════════════════════════════ */
function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* دکمه همبرگری */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-kalako-navy hover:bg-kalako-slate-100 transition-colors"
        aria-label="باز کردن منو"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* بک‌دراپ */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 md:hidden
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* پنل کشویی */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 md:hidden
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* هدر */}
        <div className="flex items-center justify-between px-4 py-4">
          <KalakoLogo />
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-full text-kalako-slate-500 hover:text-kalako-navy hover:bg-kalako-slate-100 transition-colors"
            aria-label="بستن منو"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* آیتم‌های منو */}
        <nav className="flex flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors
                ${
                  item.active
                    ? "bg-amber-50 text-kalako-navy font-bold"
                    : "text-kalako-slate-600 hover:bg-kalako-slate-100 hover:text-kalako-navy"
                }`}
            >
              {item.label}
              {item.active && (
                <span className="mr-auto h-2 w-2 rounded-full bg-kalako-orange" />
              )}
            </a>
          ))}
        </nav>

        {/* دکمه ورود */}
        <div className="mt-auto p-4">
          <button className="w-full flex items-center justify-center gap-2 rounded-full bg-kalako-navy text-white py-3 text-sm font-medium hover:bg-kalako-navy-light transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ورود / ثبت‌نام
          </button>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   Navbar — کامپوننت اصلی
   ══════════════════════════════════════════ */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-kalako-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* سمت راست: لوگو */}
        <KalakoLogo className="shrink-0" />

        {/* وسط: منوها (فقط دسکتاپ) */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <NavbarItem key={item.label} item={item} />
          ))}
        </nav>

        {/* سمت چپ: علاقه‌مندی + ورود + منوی موبایل */}
        <div className="flex items-center gap-2">
          {/* آیکون علاقه‌مندی */}
          <button
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-kalako-slate-500 hover:text-kalako-red hover:bg-red-50 transition-colors"
            aria-label="علاقه‌مندی‌ها"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* دکمه ورود (دسکتاپ) */}
          <button className="hidden md:flex items-center gap-2 rounded-full bg-kalako-navy text-white px-5 py-2.5 text-sm font-medium hover:bg-kalako-navy-light transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ورود / ثبت‌نام
          </button>

          {/* منوی همبرگری (موبایل) */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
