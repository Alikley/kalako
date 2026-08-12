"use client";

import { useState } from "react";
import Link from "next/link";
import { KalakoLogo } from "../KalakoLogo";
import { useStore, CATEGORIES, BRANDS } from "@/hook/useStore";
import { DropItem } from "./DropItem";
import { CartIcon, HeartIcon, UserIcon } from "./NavIcons";

export function MobileMenu() {
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
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
              {"تخفیف "}{c}
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
            <UserIcon /> {"ورود"}
          </Link>
        </div>
      </div>
    </>
  );
}
