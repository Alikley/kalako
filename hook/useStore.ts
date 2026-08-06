import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  title: string;
  price: string;
  oldPrice: string | null;
  discount: string | null;
  badge: string | null;
  shipping: string;
  channel: string;
  image: string;
}

export const CATEGORIES = [
  "\u062a\u06cc\u200c\u0634\u0631\u062a",
  "\u0634\u0644\u0648\u0627\u0631",
  "\u06a9\u062a\u0648\u0646\u06cc",
  "\u06a9\u0641\u0634",
  "\u0644\u0628\u0627\u0633",
  "\u0647\u0648\u062f\u06cc",
  "\u0645\u0627\u0646\u062a\u0648",
  "\u067e\u0627\u0644\u062a\u0648",
  "\u0634\u0648\u0631\u062a",
  "\u0644\u0648\u0627\u0632\u0645 \u062e\u0627\u0646\u0647",
];

export const BRANDS = [
  "\u0646\u0627\u06cc\u06a9\u06cc", "\u0622\u062f\u06cc\u062f\u0627\u0633", "\u067e\u0648\u0645\u0627", "\u0631\u06cc\u0628\u0648\u06a9",
  "\u0646\u06cc\u0648\u0628\u0627\u0644\u0627\u0646\u0633", "\u06a9\u0646\u0648\u0631\u0633", "\u0644\u06cc\u0648\u0627\u06cc\u0632", "\u0632\u0627\u0631\u0627",
  "\u0647\u0627\u06cc \u062f\u0646\u06cc\u0632", "\u067e\u0648\u0644\u0648", "\u0627\u06cc\u0646\u062f\u06cc\u0627\u0646", "\u0634\u06cc\u06a9\u0648",
  "\u0647\u0648\u0645\u0646", "\u0645\u062c\u0644\u0633\u06cc", "\u0627\u0644 \u0633\u0627\u0639\u06cc",
  "\u0628\u0648\u0634", "\u0646\u06cc\u0648\u06cc\u0645\u0628\u0631\u0627\u0646\u0633",
  "\u0633\u0627\u0645\u0633\u0648\u0646\u06af", "\u0627\u0644 \u0627\u06cc", "\u0645\u06cc\u0632\u0648\u0646\u0648",
  "\u0644\u0627\u06a9\u0648\u0633\u062a", "\u06af\u0627\u067e", "\u0627\u06cc\u0641\u0648\u0646",
];

interface StoreState {
  likes: number[];
  cart: Product[];
  toggleLike: (id: number) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
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
