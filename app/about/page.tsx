import React from "react";
import { CATEGORIES, BRANDS } from "@/hook/useStore";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-black text-kalako-navy mb-4">درباره کالاکو</h1>
        <div className="w-16 h-1 bg-kalako-orange rounded-full mb-8" />
        <div className="prose prose-slate max-w-none space-y-6 text-kalako-slate-600 leading-loose">
          <p>کالاکو یک پلتفرم جستجوی هوشمند لباس و پوشاک است که با استفاده از هوش مصنوعی، بهترین قیمت‌ها را از کانال‌های فروشگاهی تلگرام پیدا می‌کند. هدف ما این است که خریداران بتوانند بدون نیاز به جستجوی دستی در ده‌ها کانال، به سرعت محصول مورد نظر خود را با بهترین قیمت پیدا کنند.</p>
          <p>ما با <strong className="text-kalako-navy">۷ دسته‌بندی اصلی</strong> شامل {CATEGORIES.slice(0, 5).join("، ")} و ده‌ها برند معتبر مانند {BRANDS.slice(0, 5).join("، ")}، یکی از کامل‌ترین پایگاه‌های جستجوی پوشاک و لوازم در ایران هستیم.</p>
          <p>تیم کالاکو متشکل از توسعه‌دهندگان و طراحان با تجربه است که با بهره‌گیری از فناوری‌های روز دنیا، تجربه خرید آنلاین را برای کاربران فارسی‌زبان ساده‌تر و لذت‌بخش‌تر کرده‌اند.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            {[{ num: "۱۲M+", label: "کاربر فعال" }, { num: "۱۰۱+", label: "کانال فروشگاهی" }, { num: "40K+", label: "محصول" }].map((s) => (
              <div key={s.label} className="bg-kalako-cream rounded-2xl p-6 text-center">
                <div className="text-2xl font-black text-kalako-orange">{s.num}</div>
                <div className="text-sm text-kalako-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}