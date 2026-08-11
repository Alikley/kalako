"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/hook/useStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useStore();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-kalako-navy">
            سبد خرید ({cart.length})
          </h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-kalako-red hover:underline"
            >
              پاک کردن سبد
            </button>
          )}
        </div>
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 mx-auto text-kalako-slate-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <p className="text-kalako-slate-500 mb-4">سبد خریدت خالیه</p>
            <Link
              href="/"
              className="text-kalako-orange font-medium hover:underline"
            >
              بگرد به صفحه اصلی
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-kalako-cream rounded-2xl p-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-contain bg-white rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-kalako-navy">
                    {item.title}
                  </h3>
                  <p className="text-sm font-bold text-kalako-orange mt-1">
                    {formatPrice(item.price)} تومان
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-kalako-red hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <div className="mt-6 bg-kalako-navy text-white rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-white/60 text-sm">جمع کل</span>
                <div className="text-xl font-bold mt-1">{cart.length} کالا</div>
              </div>
              <button className="bg-kalako-orange text-kalako-navy font-bold px-8 py-3 rounded-xl hover:bg-kalako-orange-hover transition-colors">
                ادامه خرید
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
