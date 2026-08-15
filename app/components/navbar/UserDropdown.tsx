"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, UserIcon } from "./NavbarIcons";

export function UserDropdown({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative"
    >
      <button className="flex items-center gap-2 bg-kalako-slate-100 px-4 py-2.5 rounded-full hover:bg-kalako-slate-200 transition-colors cursor-pointer">
        <UserIcon />
        <span className="text-sm font-medium text-kalako-navy">{userName}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-kalako-slate-200/60 py-2 min-w-[180px]">
            <Link
              href="/edit"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-kalako-slate-600 hover:text-kalako-navy hover:bg-kalako-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {"ویرایش"}
            </Link>

            <Link
              href="/transactions"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-kalako-slate-600 hover:text-kalako-navy hover:bg-kalako-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {"تراکنش‌ها"}
            </Link>

            <div className="border-t border-kalako-slate-200/60 my-1" />

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-kalako-red hover:bg-red-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {"خروج"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
