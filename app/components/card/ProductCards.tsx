"use client";

import React from "react";

const PRODUCTS = [
  {
    id: 1,
    title: "کتونی نایکی ایر مکس ۱",
    price: "۲,۸۵۰,۰۰۰",
    oldPrice: "۳,۵۰۰,۰۰۰",
    discount: "۱۸%",
    badge: "پیشنهاد",
    shipping: "ارسال رایگان",
    channel: "فروشگاه نایکی",
    image: "https://placehold.co/300x300/f3f4f6/94a3b8?text=Nike+AM1",
  },
  {
    id: 2,
    title: "هودی آدیداس اسلشو",
    price: "۱,۹۵۰,۰۰۰",
    oldPrice: null,
    discount: null,
    badge: null,
    shipping: "ارسال سریع",
    channel: "آدیداس ایران",
    image: "https://placehold.co/300x300/f3f4f6/94a3b8?text=Adidas+Hoodie",
  },
  {
    id: 3,
    title: "شلوار جین لیوایز ۵۰۱",
    price: "۳,۲۰۰,۰۰۰",
    oldPrice: "۴,۱۰۰,۰۰۰",
    discount: "۲۲%",
    badge: "پیشنهاد",
    shipping: "ارسال رایگان",
    channel: "لیوایز اوریجینال",
    image: "https://placehold.co/300x300/f3f4f6/94a3b8?text=Levis+501",
  },
  {
    id: 4,
    title: "تی‌شرت نایکی دری‌فیت",
    price: "۸۹۰,۰۰۰",
    oldPrice: "۱,۱۵۰,۰۰۰",
    discount: "۲۳%",
    badge: "پیشنهاد",
    shipping: "ارسال سریع",
    channel: "فروشگاه نایکی",
    image: "https://placehold.co/300x300/f3f4f6/94a3b8?text=Nike+DriFit",
  },
  {
    id: 5,
    title: "کفش کالج مردانه نوین",
    price: "۱,۴۵۰,۰۰۰",
    oldPrice: null,
    discount: null,
    badge: null,
    shipping: "ارسال رایگان",
    channel: "کالج نوین",
    image: "https://placehold.co/300x300/f3f4f6/94a3b8?text=Novin+Loafer",
  },
];

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  );
}

function ChannelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function ProductCard({ product }: { product: (typeof PRODUCTS)[0] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow duration-300 group">
      {/* Image Area */}
      <div className="relative bg-[#F3F4F6] aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Heart Icon */}
        <button className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-kalako-slate-400 hover:text-kalako-red transition-colors duration-200">
          <HeartIcon className="w-4 h-4" />
        </button>

        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-3 right-3 bg-kalako-red text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
            {product.discount}
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col gap-2.5">
        {/* Badge */}
        {product.badge && (
          <span className="inline-flex self-start bg-kalako-orange/10 text-kalako-orange text-[11px] font-bold px-2.5 py-1 rounded-lg">
            {product.badge}
          </span>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-kalako-navy leading-relaxed line-clamp-2">
          {product.title}
        </h3>

        {/* Channel */}
        <div className="flex items-center gap-1.5 bg-kalako-slate-100 rounded-lg px-2.5 py-1.5 self-start">
          <ChannelIcon className="w-3.5 h-3.5 text-kalako-slate-400" />
          <span className="text-[11px] text-kalako-slate-500 font-medium">{product.channel}</span>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-bold text-kalako-orange">
            {product.price}
            <span className="text-[11px] font-normal text-kalako-slate-500 mr-1">تومان</span>
          </span>
          {product.oldPrice && (
            <span className="text-xs text-kalako-slate-400 line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

        {/* Shipping Status */}
        <div className="flex items-center gap-1.5">
          <CheckCircleIcon className="w-4 h-4 text-kalako-orange" />
          <span className="text-[11px] text-kalako-slate-500">{product.shipping}</span>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-kalako-navy text-white text-[13px] font-medium py-2.5 rounded-xl hover:bg-kalako-navy-light transition-colors duration-200">
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}

export function ProductCards() {
  return (
    <div className="flex-1 min-w-0">
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
