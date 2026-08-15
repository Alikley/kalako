"use client";

import React from "react";
import { BotStatusBadge } from "./BotStatusBadge";

interface EmptyStateProps {
  icon: "warning" | "search" | "info";
  title: string;
  subtitle?: string;
  meta?: any;
  actions?: React.ReactNode;
}

function StateIcon({ type }: { type: EmptyStateProps["icon"] }) {
  if (type === "warning") {
    return (
      <svg
        className="w-16 h-16 text-kalako-slate-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    );
  }
  if (type === "search") {
    return (
      <svg
        className="w-16 h-16 text-kalako-slate-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-16 h-16 text-kalako-slate-300 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

export function EmptyState({ icon, title, subtitle, meta, actions }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
      {meta && <BotStatusBadge meta={meta} />}
      <StateIcon type={icon} />
      <p className={title.startsWith("خطا") ? "text-kalako-red text-sm font-medium mb-2" : "text-kalako-slate-500 text-sm mb-2"}>{title}</p>
      {subtitle && (
        <p className="text-kalako-slate-400 text-xs mb-4 max-w-md">{subtitle}</p>
      )}
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}
