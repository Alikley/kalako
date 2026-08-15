"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KalakoLogo } from "./KalakoLogo";
import { useStore, CATEGORIES, BRANDS } from "@/hook/useStore";
import { HeartIcon, CartIcon, UserIcon } from "./navbar/NavbarIcons";
import { NavDropdown, DropItem } from "./navbar/NavDropdown";
import { MobileMenu } from "./navbar/MobileMenu";

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
            {"خانه"}
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
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 bg-kalako-navy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-kalako-navy-light transition-colors"
          >
            <UserIcon /> {"ورود / ثبت‌نام"}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
