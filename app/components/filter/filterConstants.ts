import { createTheme } from "@mui/material";

export const muiTheme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Vazirmatn, system-ui, sans-serif",
  },
  palette: {
    primary: { main: "#F59E0B" },
    text: { primary: "#1E293B", secondary: "#64748B" },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiSelect-select": {
            padding: "10px 14px",
            fontSize: "14px",
            borderRadius: "12px",
            backgroundColor: "#F1F5F9",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          fontFamily: "Vazirmatn, system-ui, sans-serif",
          justifyContent: "flex-start",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: "#F59E0B", padding: "16px 0" },
        thumb: {
          width: 16,
          height: 16,
          "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 6px rgba(245,158,11,0.2)" },
        },
        rail: { backgroundColor: "#E2E8F0" },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
          "&.Mui-checked": { color: "#F59E0B" },
        },
      },
    },
  },
});

/**
 * v1.0.0.9: دسته‌های فیلتر با داده واقعی بات هماهنگ شد
 * (CLOTHING_HASHTAG_MAP بات: تی‌شرت، شلوار، کتونی، کفش، لباس، هودی، مانتو، پالتو، شورت، لوازم خانه)
 * دسته‌های قبلی «لباس بالاتنه» و «کت و شلوار مجلسی» در داده بات وجود نداشتند و نتیجه خالی می‌دادند
 */
export const FILTER_ALL = "همه";

export const FILTER_CATEGORIES = [
  FILTER_ALL,
  "کفش",
  "کتونی",
  "تی‌شرت",
  "شلوار",
  "لباس",
  "هودی",
  "مانتو",
  "پالتو",
  "شورت",
  "لوازم خانه",
];

/**
 * v1.0.0.9: جنسیت‌ها با مقادیر ذخیره‌شده در دیتابیس بات هماهنگ شد
 * (بات فقط «مردانه»/«زنانه» ذخیره می‌کند؛ پست‌های کودک قبلاً حذف می‌شوند)
 */
export const FILTER_GENDERS = [
  "مردانه",
  "زنانه",
];

export const FILTER_COLORS = [
  { name: "سیاه", hex: "#1E293B" },
  { name: "سفید", hex: "#FFFFFF" },
  { name: "قرمز", hex: "#EF4444" },
  { name: "آبی", hex: "#3B82F6" },
  { name: "سبز", hex: "#22C55E" },
  { name: "زرد", hex: "#EAB308" },
];

export function valuetext(value: number) {
  const formatted = value.toLocaleString("fa-IR");
  return formatted;
}
