"use client";

import Link from "next/link";

export function DropItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-kalako-slate-600 hover:text-kalako-navy hover:bg-kalako-slate-100 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
