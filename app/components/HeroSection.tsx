"use client";

import React from "react";
import { SearchBar } from "./SearchBar";

function IconSmartSearch() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10l1.5 1.5L17 9" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function IconSpeed() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/60 rounded-2xl border border-white/80 hover:shadow-md transition-shadow duration-200 cursor-default group">
      <div className="w-12 h-12 mb-3 flex items-center justify-center text-kalako-navy group-hover:text-kalako-orange transition-colors duration-200">
        {icon}
      </div>
      <h4 className="font-bold text-sm text-kalako-navy mb-1">{title}</h4>
      <p className="text-[11px] text-kalako-slate-500 text-center leading-relaxed">{desc}</p>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full bg-kalako-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-32 top-12 w-[500px] h-[500px] bg-kalako-navy rounded-tr-[100%] rounded-br-[100%] -rotate-6" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col justify-center pt-8 lg:pt-16 lg:pl-8">
            <div className="flex items-center gap-2 mb-6 justify-start">
              <svg className="w-5 h-5 text-kalako-orange fill-kalako-orange" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-kalako-orange font-bold text-base tracking-wide">جستجو، کنکاش، پیدا!</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-kalako-navy leading-tight text-left mb-6 tracking-tight">
              بهترین قیمت
              <br />
              بازار از کالاکو
            </h1>

            <p className="text-kalako-slate-500 text-left text-lg leading-loose font-light max-w-md">
              فرصت محدود برای خریداران، گشت‌وگذار تخفیف‌ها
              <br />
              با سرعت و هوشمندی بدن کشف
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8 pt-4">
            <SearchBar />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
              <FeatureCard title="جستجوی هوشمند" desc="با هوش مصنوعی جستجو کنید" icon={<IconSmartSearch />} />
              <FeatureCard title="فیلتر دقیق" desc="بر اساس نیاز خود جستجو" icon={<IconFilter />} />
              <FeatureCard title="سرعت و پایداری" desc="جستجوهای لحظه‌ای و سریع" icon={<IconSpeed />} />
              <FeatureCard title="ارزان‌ترین قیمت" desc="کانال‌های فروشگاهی معتبر" icon={<IconShield />} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
