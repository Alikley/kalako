import { clsx, type ClassValue } from "clsx";
// Fallback for environments without the `tailwind-merge` package.
// This basic implementation returns the input string unchanged.
// If `tailwind-merge` is available in the environment, replace this
// with: import { twMerge } from "tailwind-merge";
function twMerge(input: string) {
  return input;
}

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
