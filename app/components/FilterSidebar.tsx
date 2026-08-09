"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Collapse,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const muiTheme = createTheme({
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

const CATEGORIES = ["\u06a9\u0641\u0634", "\u0644\u0628\u0627\u0633 \u0628\u0627\u0644\u0627\u062a\u0646", "\u0634\u0644\u0648\u0627\u0631", "\u062a\u06cc\u200c\u0634\u0631\u062a", "\u0647\u0648\u062f\u06cc", "\u06a9\u062a \u0648 \u0634\u0644\u0648\u0627\u0631 \u0645\u062c\u0644\u0633\u06cc"];

const GENDERS = ["\u0645\u0631\u062f\u0627\u0646\u0647", "\u0632\u0646\u0627\u0646\u0647", "\u06cc\u0648\u0646\u06cc\u0633\u06a9\u0633", "\u0628\u0686\u0647\u06af\u0627\u0646"];

const COLORS = [
  { name: "\u0633\u06cc\u0627\u0647", hex: "#1E293B" },
  { name: "\u0633\u0641\u06cc\u062f", hex: "#FFFFFF" },
  { name: "\u0642\u0631\u0645\u0632", hex: "#EF4444" },
  { name: "\u0622\u0628\u06cc", hex: "#3B82F6" },
  { name: "\u0633\u0628\u0632", hex: "#22C55E" },
  { name: "\u0632\u0631\u062f", hex: "#A855F7" },
];

function valuetext(value: number) {
  const formatted = value.toLocaleString("fa-IR");
  return `${formatted}`;
}

export function FilterSidebar() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedGender, setSelectedGender] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([100000, 10000000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [categoryOpen, setCategoryOpen] = useState(true);
  const [genderOpen, setGenderOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorsOpen, setColorsOpen] = useState(false);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <ThemeProvider theme={muiTheme}>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: "16px",
            p: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            direction: "rtl",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <FilterListIcon sx={{ color: "#1E293B", fontSize: 22 }} />
            <Box
              component="span"
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              {"\u0641\u06cc\u0644\u062a\u0631\u0647\u0627"}
            </Box>
          </Box>

          {/* Category Section */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                cursor: "pointer",
              }}
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              <Box
                component="span"
                sx={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}
              >
                {"\u062f\u0633\u062a\u0647\u200c\u0628\u0646\u062f\u06cc"}
              </Box>
              <IconButton size="small" sx={{ p: 0 }}>
                {categoryOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 18, color: "#64748B" }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18, color: "#64748B" }} />
                )}
              </IconButton>
            </Box>
            <Collapse in={categoryOpen}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#F1F5F9",
                    "& .MuiSelect-icon": { color: "#94A3B8" },
                    "&:hover": { backgroundColor: "#E2E8F0" },
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Collapse>
          </Box>

          {/* Gender Section */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                cursor: "pointer",
              }}
              onClick={() => setGenderOpen(!genderOpen)}
            >
              <Box
                component="span"
                sx={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}
              >
                {"\u062c\u0646\u0633\u06cc\u062a"}
              </Box>
              <IconButton size="small" sx={{ p: 0 }}>
                {genderOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 18, color: "#64748B" }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18, color: "#64748B" }} />
                )}
              </IconButton>
            </Box>
            <Collapse in={genderOpen}>
              <RadioGroup
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                {GENDERS.map((g) => (
                  <FormControlLabel
                    key={g}
                    value={g}
                    control={<Radio size="small" />}
                    label={
                      <Box
                        component="span"
                        sx={{ fontSize: "13px", color: "#475569" }}
                      >
                        {g}
                      </Box>
                    }
                    sx={{
                      m: 0,
                      py: 0.5,
                      px: 1,
                      borderRadius: "8px",
                      "&:hover": { backgroundColor: "#F8FAFC" },
                    }}
                  />
                ))}
              </RadioGroup>
            </Collapse>
          </Box>

          {/* Price Range Section */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                cursor: "pointer",
              }}
              onClick={() => setPriceOpen(!priceOpen)}
            >
              <Box
                component="span"
                sx={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}
              >
                {"\u0628\u0627\u0632\u0647 \u0642\u06cc\u0645\u062a (\u062a\u0648\u0645\u0627\u0646)"}
              </Box>
              <IconButton size="small" sx={{ p: 0 }}>
                {priceOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 18, color: "#64748B" }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18, color: "#64748B" }} />
                )}
              </IconButton>
            </Box>
            <Collapse in={priceOpen}>
              <Box sx={{ px: 1 }}>
                <Slider
                  getAriaLabel={() => "Price range"}
                  value={priceRange}
                  onChange={(_, newValue) => setPriceRange(newValue as number[])}
                  min={100000}
                  max={10000000}
                  step={100000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={valuetext}
                  disableSwap
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <Box
                    component="span"
                    sx={{ fontSize: "11px", color: "#64748B" }}
                  >
                    {priceRange[1].toLocaleString("fa-IR")}+
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontSize: "11px", color: "#64748B" }}
                  >
                    {priceRange[0].toLocaleString("fa-IR")}
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </Box>

          {/* Colors Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setColorsOpen(!colorsOpen)}
            >
              <Box
                component="span"
                sx={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}
              >
                {"\u0631\u0646\u06af\u200c\u0647\u0627"}
              </Box>
              <IconButton size="small" sx={{ p: 0 }}>
                {colorsOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 18, color: "#64748B" }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 18, color: "#64748B" }} />
                )}
              </IconButton>
            </Box>
            <Collapse in={colorsOpen}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
                {COLORS.map((c) => {
                  const isSelected = selectedColors.includes(c.name);
                  return (
                    <Box
                      key={c.name}
                      onClick={() => toggleColor(c.name)}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: c.hex,
                        border: isSelected
                          ? "2.5px solid #F59E0B"
                          : c.hex === "#FFFFFF"
                          ? "1.5px solid #E2E8F0"
                          : "1.5px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.15)",
                          borderColor: "#F59E0B",
                        },
                      }}
                      title={c.name}
                    />
                  );
                })}
              </Box>
            </Collapse>
          </Box>
        </Box>
      </ThemeProvider>
    </aside>
  );
}