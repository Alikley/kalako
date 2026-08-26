"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { KalakoLogo } from "./KalakoLogo";
import { useStore, CATEGORIES } from "@/hook/useStore";
import { HeartIcon, CartIcon, UserIcon } from "./navbar/NavbarIcons";
import { NavDropdown, DropItem } from "./navbar/NavDropdown";
import { UserDropdown } from "./navbar/UserDropdown";
import { MobileMenu } from "./navbar/MobileMenu";

/**
 * v1.0.0.7: کلیک روی لوگو → رفرش کامل صفحه و بازگشت به صفحه اول
 * چون سرچ state کلاینت‌سایده، Link معمولی Next.js صفحه رو ریست نمی‌کنه؛
 * برای همین ناوبری کامل (hard navigation) انجام می‌دیم تا همه‌چیز از صفر لود بشه.
 */
function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  window.location.href = "/";
}

/**
 * v1.0.4.0: کلیک روی گروه دسته‌بندی → سرچ گروهی (مثل سرچ‌بار)
 *
 * کاربر: «میخوام دسته بندی ها وصل نباشه به محصولاتی که در صفحه اصلی نشون
 *         میدی... وقتی کاربر زد مثلا پوشاک یه جست جو باشه نه از دیتابیس
 *         صفحه اصلی وصل باشه به دیتابیس سرچ»
 *
 * فقط ۷ تایتل گروه تو دراپ‌داون نشون داده میشه؛ کلیک → /?cat=<گروه> →
 * ProductCards حالت دسته‌بندی رو با «سرچ گروهی» فعال میکنه (مسیر
 * /api/search — DB سرچ، تا ۲۰۰ پست). hard navigation تا state فیلتر/سرچ
 * قبلی ریست بشه.
 */
function categoryNav(group: string) {
  window.location.href = "/?cat=" + encodeURIComponent(group);
}

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const likes = useStore((s) => s.likes);
  const cart = useStore((s) => s.cart);

  return (
    <header className="sticky top-0 z-40 w-full bg-kalako-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          onClick={handleLogoClick}
          aria-label="کالاکو — بازگشت به صفحه اصلی (رفرش صفحه)"
          title="بازگشت به صفحه اصلی"
          className="cursor-pointer"
        >
          <KalakoLogo className="shrink-0" />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`py-2 text-sm font-medium transition-colors ${pathname === "/" ? "text-kalako-navy" : "text-kalako-slate-500 hover:text-kalako-navy"}`}
          >
            {"خانه"}
          </Link>

          {/* v1.0.3.0: دسته‌بندی‌ها — فقط ۷ تایتل گروه؛ کلیک → /?cat=<گروه> */}
          <NavDropdown label="دسته‌بندی‌ها">
            {CATEGORIES.map((c) => (
              <DropItem key={c} onClick={() => categoryNav(c)}>
                {c}
              </DropItem>
            ))}
          </NavDropdown>

          {/* v1.0.3.0: برندها از نوبار حذف شد (کاربر: «گزینه برند هارو توی نوبار حذف کنی») */}

          <NavDropdown label="تخفیف‌ها">
            {CATEGORIES.map((c) => (
              <DropItem
                key={c}
                href={`/discounts?cat=${encodeURIComponent(c)}`}
              >
                {"تخفیف "}
                {c}
              </DropItem>
            ))}
          </NavDropdown>

          <Link
            href="/about"
            className={`py-2 text-sm font-medium transition-colors ${pathname === "/about" ? "text-kalako-navy" : "text-kalako-slate-500 hover:text-kalako-navy"}`}
          >
            {"درباره ما"}
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
          {session ? (
            <div className="hidden md:block">
              <UserDropdown userName={session.user?.name || ""} />
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 bg-kalako-navy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-kalako-navy-light transition-colors"
            >
              <UserIcon /> {"ورود / ثبت‌نام"}
            </Link>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
