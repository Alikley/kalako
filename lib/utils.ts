import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * فرمت قیمت — عدد رو به رشته فارسی تبدیل میکنه
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price == null) return "";
  const num = Number(price);
  if (isNaN(num)) return "";
  return num.toLocaleString("fa-IR");
}
