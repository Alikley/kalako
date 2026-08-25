import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSession } from "next-auth/react";

/**
 * v1.0.0.7.13:
 *  - لایک و سبد خرید با دیتابیس همگام میشن
 *  - اگه کاربر لاگین باشه: دیتابیس منبع اصلیه
 *  - اگه کاربر مهمان باشه: localStorage مثل قبل
 */
export interface Product {
  id: string;
  title: string;
  price: number | null;
  oldPrice: number | null;
  discount: string | null;
  badge: string | null;
  shipping: string;
  channel: string;
  image: string;
  link?: string;
  date?: string;
  views?: number;
  channelId?: string;
  /** v1.0.0.9: نوع پوشاک از بات — برای فیلتر دسته‌بندی سایدبار */
  clothingType?: string;
  /** v1.0.0.9: جنسیت از بات — برای فیلتر جنسیت سایدبار */
  gender?: string;
}

export const CATEGORIES = [
  "تی‌شرت",
  "شلوار",
  "کتونی",
  "کفش",
  "لباس",
  "هودی",
  "مانتو",
  "پالتو",
  "شورت",
  "لوازم خانه",
];

export const BRANDS = [
  "نایکی", "آدیداس", "پوما", "ریبوک",
  "نیوبالانس", "کنورس", "لیوایز", "زارا",
  "های دنیز", "پولو", "ایندیان", "شیکو",
  "هومن", "مجلس", "ال ساعی",
  "بوش", "نیویمبرانس",
  "سامسونگ", "ال ای", "میزونو",
  "لاکوست", "گاپ", "ایفون",
];

interface StoreState {
  likes: string[];
  cart: Product[];
  toggleLike: (id: string) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setLikes: (ids: string[]) => void;
  setCart: (items: Product[]) => void;
  syncFromDB: (userId: number | undefined) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      likes: [],
      cart: [],

      // ── لایک ────────────────────────────
      toggleLike: async (id) => {
        // اول UI رو آپدیت کن (سریع)
        const isLiked = get().likes.includes(id);
        set((s) => ({
          likes: isLiked ? s.likes.filter((i) => i !== id) : [...s.likes, id],
        }));

        // بعد بفرست سمت سرور (اگه لاگین هست)
        try {
          const res = await fetch("/api/likes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id }),
          });
          if (!res.ok) {
            // اگه خطا داد، برگردون به حالت قبلی
            set((s) => ({
              likes: isLiked
                ? [...s.likes, id]
                : s.likes.filter((i) => i !== id),
            }));
          }
        } catch {
          // اینترنت قطعه — فقط لوکال کار میکنه
        }
      },

      // ── سبد خرید ────────────────────────
      addToCart: async (p) => {
        if (get().cart.some((c) => c.id === p.id)) return;

        // اول UI
        set((s) => ({ cart: [...s.cart, p] }));

        // بعد سرور
        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
          });
          if (!res.ok) {
            set((s) => ({ cart: s.cart.filter((c) => c.id !== p.id) }));
          }
        } catch {
          // اینترنت قطعه
        }
      },

      removeFromCart: async (id) => {
        set((s) => ({ cart: s.cart.filter((c) => c.id !== id) }));
        try {
          await fetch(`/api/cart?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
        } catch {
          // اینترنت قطعه
        }
      },

      clearCart: async () => {
        set({ cart: [] });
        try {
          await fetch("/api/cart?action=clear", { method: "DELETE" });
        } catch {
          // اینترنت قطعه
        }
      },

      // ──setterها برای همگام‌سازی از DB ──
      setLikes: (ids) => set({ likes: ids }),
      setCart: (items) => set({ cart: items }),

      // ─ـ بارگذاری از دیتابیس ────────────
      syncFromDB: async (userId) => {
        if (!userId) return;
        try {
          const [likesRes, cartRes] = await Promise.all([
            fetch("/api/likes"),
            fetch("/api/cart"),
          ]);

          if (likesRes.ok) {
            const data = await likesRes.json();
            if (data.likes) set({ likes: data.likes });
          }

          if (cartRes.ok) {
            const data = await cartRes.json();
            if (data.cart) set({ cart: data.cart });
          }
        } catch {
          // خطا در ارتباط با سرور
        }
      },
    }),
    { name: "kalako-store" }
  )
);