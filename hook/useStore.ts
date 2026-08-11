import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * v1.0.0.5.12:
 *  - fix: id از number به string تغییر کرد (بات "channelId_postId" برمی‌گردونه)
 *  - fix: price و oldPrice از string به number | null (بات عدد برمی‌گردونه)
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
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      likes: [],
      cart: [],
      toggleLike: (id) =>
        set((s) => ({
          likes: s.likes.includes(id)
            ? s.likes.filter((i) => i !== id)
            : [...s.likes, id],
        })),
      addToCart: (p) =>
        set((s) => ({
          cart: s.cart.some((c) => c.id === p.id) ? s.cart : [...s.cart, p],
        })),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: "kalako-store" }
  )
);