"use client";

import { useState } from "react";
import { useStore, type Product } from "@/hook/useStore";
import { ProductHeartIcon, CheckCircleIcon, CartPlusIcon, ChannelIcon } from "./ProductIcons";

export function ProductCard({ product }: { product: Product }) {
  const { likes, toggleLike, addToCart, cart } = useStore();
  const isLiked = likes.includes(product.id);
  const inCart = cart.some((c) => c.id === product.id);
  const priceFormatted = product.price
    ? product.price.toLocaleString("fa-IR")
    : null;
  const [imgError, setImgError] = useState(false);

  let dateStr = "";
  if (product.date) {
    try {
      dateStr = new Date(product.date).toLocaleDateString("fa-IR");
    } catch {
      dateStr = "";
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow duration-300 group">
      <div className="relative bg-[#F3F4F6] aspect-[3/4] overflow-hidden">
        {!imgError && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-kalako-slate-300">
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        <button
          onClick={() => toggleLike(product.id)}
          className={`absolute top-3 left-3 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors duration-200 ${
            isLiked
              ? "bg-red-50 text-kalako-red"
              : "bg-white/80 text-kalako-slate-400 hover:text-kalako-red"
          }`}
          aria-label={isLiked ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
        >
          <ProductHeartIcon className="w-4 h-4" filled={isLiked} />
        </button>

        {product.discount && (
          <span className="absolute top-3 right-3 bg-kalako-red text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
            {product.discount}
          </span>
        )}

        {(product.views ?? 0) > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-lg">
            {(product.views ?? 0).toLocaleString("fa-IR")} {"بازدید"}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-kalako-navy leading-relaxed line-clamp-2">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5 self-start">
          <ChannelIcon className="w-3.5 h-3.5 text-kalako-slate-400" />
          {product.channelId ? (
            <a
              href={`https://t.me/${product.channelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-kalako-slate-500 font-medium hover:text-kalako-orange transition-colors"
            >
              {product.channel}
            </a>
          ) : (
            <span className="text-[11px] text-kalako-slate-500 font-medium">
              {product.channel}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {priceFormatted ? (
            <span className="text-[15px] font-bold text-kalako-orange">
              {priceFormatted}
              <span className="text-[11px] font-normal text-kalako-slate-500 mr-1">
                {"تومان"}
              </span>
            </span>
          ) : (
            <span className="text-[13px] text-kalako-slate-400">
              {"قیمت نامشخص"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <CheckCircleIcon className="w-4 h-4 text-kalako-orange" />
          <span className="text-[11px] text-kalako-slate-500">{dateStr}</span>
        </div>

        <button
          onClick={() => !inCart && addToCart(product)}
          disabled={inCart}
          className={`flex-1 text-[13px] font-medium py-2.5 rounded-xl transition-colors duration-200 text-center flex items-center justify-center gap-1.5 ${
            inCart
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-kalako-navy text-white hover:bg-kalako-navy-light"
          }`}
        >
          {inCart ? ("در سبد خرید") : ("افزودن به سبد")}
          <CartPlusIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
