"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { KalakoLogo } from "../KalakoLogo";
import { useStore, CATEGORIES } from "@/hook/useStore";
import { CartIcon, HeartIcon, UserIcon } from "./NavbarIcons";
import { DropItem } from "./NavDropdown";

/**
 * v1.0.3.0: کلیک روی گروه دسته‌بندی در منوی موبایل → نمای دسته‌بندی
 * (همانند نوار دسکتاپ — به /?cat=<گروه> هدایت می‌شه، حداکثر 200 پست)
 */
function categoryNavMobile(group: string, closeFn: () => void) {
  closeFn();
  window.location.href = "/?cat=" + encodeURIComponent(group);
}

export function MobileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const likes = useStore((s) => s.likes);
  const cart = useStore((s) => s.cart);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-kalako-navy hover:bg-kalako-slate-100"
        aria-label={"منو"}
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
          {/* v1.0.0.7: کلیک روی لوگو → رفرش کامل و بازگشت به صفحه اول */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              window.location.href = "/";
            }}
            aria-label="کالاکو — بازگشت به صفحه اصلی (رفرش صفحه)"
            className="cursor-pointer"
          >
            <KalakoLogo />
          </a>
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
          <DropItem href="/">
            {"خانه"}
          </DropItem>
          {/* v1.0.3.0: فقط ۷ تایتل گروه دسته‌بندی — کلیک → /?cat=<گروه> */}
          {CATEGORIES.map((c) => (
            <DropItem key={c} onClick={() => categoryNavMobile(c, () => setOpen(false))}>
              {c}
            </DropItem>
          ))}
          {/* v1.0.3.0: برندها از منو حذف شد (مطابق نوبار) */}
          {CATEGORIES.map((c) => (
            <DropItem
              key={`d-${c}`}
              href={`/discounts?cat=${encodeURIComponent(c)}`}
            >
              {"تخفیف "}
              {c}
            </DropItem>
          ))}
          <DropItem href="/about">
            {"درباره ما"}
          </DropItem>
        </nav>
        {session && (
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-kalako-orange/10 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserIcon />
                  <span className="text-sm font-medium text-kalako-navy">{session.user?.name}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-kalako-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="mt-1 bg-white rounded-xl shadow-lg border border-kalako-slate-200/60 py-1 overflow-hidden">
                  <Link
                    href="/edit"
                    onClick={() => { setOpen(false); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-kalako-slate-600 hover:text-kalako-navy hover:bg-kalako-slate-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {"ویرایش"}
                  </Link>
                  <Link
                    href="/transactions"
                    onClick={() => { setOpen(false); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-kalako-slate-600 hover:text-kalako-navy hover:bg-kalako-slate-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {"تراکنش‌ها"}
                  </Link>
                  <div className="border-t border-kalako-slate-200/60 my-1" />
                  <button
                    onClick={() => { setOpen(false); setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-kalako-red hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {"خروج"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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
          {!session && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-kalako-navy text-white text-sm font-medium"
            >
              <UserIcon /> {"ورود"}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
