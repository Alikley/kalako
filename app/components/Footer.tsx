"use client";

import React from "react";

function PaperPlaneIcon() {
  return (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 48 48">
      <path
        d="M6 24L24 6l18 18"
        stroke="#F59E0B"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 24l18-6 18 6"
        stroke="#F59E0B"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 42V24"
        stroke="#F59E0B"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <line x1="8" y1="30" x2="16" y2="30" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      <line x1="5" y1="35" x2="12" y2="35" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
      <line x1="10" y1="40" x2="15" y2="40" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

const STATS = [
  { icon: <UsersIcon />, number: "+۱۲ میلیون", label: "کاربر فعال" },
  { icon: <ChatBubbleIcon />, number: "+۱۰۱+", label: "کالای فعال" },
  { icon: <ShoppingBagIcon />, number: "+۴۰,۰۰۰", label: "محصولات فروشنده" },
];

export function Footer() {
  return (
    <section className="w-full bg-kalako-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-4">
        <div
          className="w-full bg-kalako-navy rounded-2xl px-6 sm:px-10 py-6 sm:py-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Right side (RTL): Paper plane icon */}
            <div className="hidden sm:flex items-center">
              <PaperPlaneIcon />
            </div>

            {/* Center: CTA text + button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1">
              <div className="text-center sm:text-right">
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  کالاکو عضو بشید و
                </p>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  کالای خودتون رو با ما بفروشید؟
                </p>
              </div>
              <button className="bg-kalako-orange hover:bg-kalako-orange-hover text-kalako-navy font-bold text-sm px-6 py-2.5 rounded-xl transition-colors duration-200 whitespace-nowrap">
                عضو کالاکو
              </button>
            </div>

            {/* Left side (RTL): Stats */}
            <div className="flex items-center gap-6 sm:gap-8">
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="mb-1.5">{stat.icon}</div>
                  <span className="text-kalako-orange font-bold text-base sm:text-lg leading-tight">
                    {stat.number}
                  </span>
                  <span className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
