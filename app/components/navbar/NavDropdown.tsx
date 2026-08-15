"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "./NavbarIcons";

export function DropItem({
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

export function NavDropdown({
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
