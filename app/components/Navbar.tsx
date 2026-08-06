"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KalakoLogo } from "./KalakoLogo";
import { useStore, CATEGORIES, BRANDS } from "@/hook/useStore";

/* ── Chevron SVG ── */
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${className || ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* ── Heart SVG ── */
function HeartIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

/* ── Cart SVG ── */
function CartIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
      />
    </svg>
  );
}

/* ── User SVG ── */
function UserIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

/* ── Dropdown Item ── */
function DropItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-kalako-slate-600 hover:text-kalako-navy hover:bg-kalako-slate-100 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

/* ── NavDropdown ── */
function NavDropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 py-2 text-sm font-medium text-kalako-slate-500 hover:text-kalako-navy transition-colors">
        {label}{" "}
        <ChevronDown className="transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-kalako-slate-200/60 py-2 min-w-[180px]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── MobileMenu ── */
function MobileMenu() {
  const [open, setOpen] = useState(false);
  const likes = useStore((s) => s.likes);
  const cart = useStore((s) => s.cart);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-kalako-navy hover:bg-kalako-slate-100"
        aria-label="منو"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity md:hidden ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <KalakoLogo />
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-kalako-slate-500 hover:text-kalako-navy"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-2">
          <DropItem href="/">خانه</DropItem>
          {CATEGORIES.map((c) => (
            <DropItem key={c} href={`/categories?cat=${encodeURIComponent(c)}`}>
              {c}
            </DropItem>
          ))}
          {BRANDS.slice(0, 8).map((b) => (
            <DropItem key={b} href={`/brands?b=${encodeURIComponent(b)}`}>
              {b}
            </DropItem>
          ))}
          {CATEGORIES.map((c) => (
            <DropItem
              key={`d-${c}`}
              href={`/discounts?cat=${encodeURIComponent(c)}`}
            >
              تخفیف {c}
            </DropItem>
          ))}
          <DropItem href="/about">درباره ما</DropItem>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-kalako-slate-100 text-sm font-medium text-kalako-navy"
          >
            <CartIcon /> {cart.length}
          </Link>
          <Link
            href="/likes"
            onClick={() => setOpen(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-kalako-slate-100 text-sm font-medium text-kalako-navy"
          >
            <HeartIcon /> {likes.length}
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-kalako-navy text-white text-sm font-medium"
          >
            <UserIcon /> ورود
          </Link>
        </div>
      </div>
    </>
  );
}

/* ════ Navbar ════ */
export function Navbar() {
  const pathname = usePathname();
  const likes = useStore((s) => s.likes);
  const cart = useStore((s) => s.cart);

  return (
    <header className="sticky top-0 z-40 w-full bg-kalako-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <KalakoLogo className="shrink-0" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`py-2 text-sm font-medium transition-colors ${pathname === "/" ? "text-kalako-navy" : "text-kalako-slate-500 hover:text-kalako-navy"}`}
          >
            خانه
          </Link>

          <NavDropdown label="دسته‌بندی‌ها">
            {CATEGORIES.map((c) => (
              <DropItem
                key={c}
                href={`/categories?cat=${encodeURIComponent(c)}`}
              >
                {c}
              </DropItem>
            ))}
          </NavDropdown>

          <NavDropdown label="برندها">
            {BRANDS.map((b) => (
              <DropItem key={b} href={`/brands?b=${encodeURIComponent(b)}`}>
                {b}
              </DropItem>
            ))}
          </NavDropdown>

          <NavDropdown label="تخفیف‌ها">
            {CATEGORIES.map((c) => (
              <DropItem
                key={c}
                href={`/discounts?cat=${encodeURIComponent(c)}`}
              >
                تخفیف {c}
              </DropItem>
            ))}
          </NavDropdown>

          <Link
            href="/about"
            className={`py-2 text-sm font-medium transition-colors ${pathname === "/about" ? "text-kalako-navy" : "text-kalako-slate-500 hover:text-kalako-navy"}`}
          >
            درباره ما
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/likes"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-kalako-slate-500 hover:text-kalako-red hover:bg-red-50 transition-colors"
          >
            <HeartIcon />
            {likes.length > 0 && (
              <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-kalako-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {likes.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-kalako-slate-500 hover:text-kalako-navy hover:bg-kalako-slate-100 transition-colors"
          >
            <CartIcon />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-kalako-orange text-kalako-navy text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-kalako-navy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-kalako-navy-light transition-colors"
          >
            <UserIcon /> ورود / ثبت‌نام
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
