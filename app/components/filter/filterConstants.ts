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

export const FILTER_CATEGORIES = [
  "\u06a9\u0641\u0634",
  "\u0644\u0628\u0627\u0633 \u0628\u0627\u0644\u0627\u062a\u0646",
  "\u0634\u0644\u0648\u0627\u0631",
  "\u062a\u06cc\u200c\u0634\u0631\u062a",
  "\u0647\u0648\u062f\u06cc",
  "\u06a9\u062a \u0648 \u0634\u0644\u0648\u0627\u0631 \u0645\u062c\u0644\u0633\u06cc",
];

export const FILTER_GENDERS = [
  "\u0645\u0631\u062f\u0627\u0646\u0647",
  "\u0632\u0646\u0627\u0646\u0647",
  "\u06cc\u0648\u0646\u06cc\u0633\u06a9\u0633",
  "\u0628\u0686\u0647\u06af\u0627\u0646",
];

export const FILTER_COLORS = [
  { name: "\u0633\u06cc\u0627\u0647", hex: "#1E293B" },
  { name: "\u0633\u0641\u06cc\u062f", hex: "#FFFFFF" },
  { name: "\u0642\u0631\u0645\u0632", hex: "#EF4444" },
  { name: "\u0622\u0628\u06cc", hex: "#3B82F6" },
  { name: "\u0633\u0628\u0632", hex: "#22C55E" },
  { name: "\u0632\u0631\u062f", hex: "#A855F7" },
];

export function valuetext(value: number) {
  const formatted = value.toLocaleString("fa-IR");
  return formatted;
}
