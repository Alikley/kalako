"use client";

import React, { useState } from "react";
import { Box, ThemeProvider, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { muiTheme, FILTER_ALL } from "./filter/filterConstants";
import { FilterSection } from "./filter/FilterSection";
import { CategoryFilter } from "./filter/CategoryFilter";
import { GenderFilter } from "./filter/GenderFilter";
import { PriceFilter } from "./filter/PriceFilter";
import { ColorFilter } from "./filter/ColorFilter";
import {
  useFilterStore,
  activeFilterCount,
} from "@/hook/useFilterStore";

/**
 * v1.0.0.9: سایدبار فیلتر به استور مشترک useFilterStore وصل شد
 * (قبلاً state محلی بی‌اثر داشت) — حالا تغییرها بلافاصله روی
 * لیست محصولات صفحه اعمال می‌شود.
 */
export function FilterSidebar() {
  // فیلترها از استور مشترک (نه state محلی)
  const category = useFilterStore((s) => s.category);
  const gender = useFilterStore((s) => s.gender);
  const priceRange = useFilterStore((s) => s.priceRange);
  const colors = useFilterStore((s) => s.colors);
  const setCategory = useFilterStore((s) => s.setCategory);
  const setGender = useFilterStore((s) => s.setGender);
  const setPriceRange = useFilterStore((s) => s.setPriceRange);
  const toggleColor = useFilterStore((s) => s.toggleColor);
  const reset = useFilterStore((s) => s.reset);

  const [categoryOpen, setCategoryOpen] = useState(true);
  const [genderOpen, setGenderOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorsOpen, setColorsOpen] = useState(false);

  const activeCount = activeFilterCount({ category, gender, priceRange, colors });

  // «همه» در استور به‌صورت "" ذخیره می‌شود
  const categoryValue = category || FILTER_ALL;

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
            position: "sticky",
            top: "16px",
          }}
        >
          {/* Header + شمارنده فیلترهای فعال */}
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
              فیلترها
            </Box>
            {activeCount > 0 && (
              <Box
                component="span"
                sx={{
                  mr: "auto",
                  bgcolor: "#F59E0B",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 700,
                  borderRadius: "999px",
                  px: 1.2,
                  py: 0.3,
                  minWidth: 22,
                  textAlign: "center",
                }}
              >
                {activeCount.toLocaleString("fa-IR")}
              </Box>
            )}
          </Box>

          {/* Category Section */}
          <FilterSection
            title="دسته‌بندی"
            open={categoryOpen}
            onToggle={() => setCategoryOpen(!categoryOpen)}
          >
            <CategoryFilter value={categoryValue} onChange={setCategory} />
          </FilterSection>

          {/* Gender Section */}
          <FilterSection
            title="جنسیت"
            open={genderOpen}
            onToggle={() => setGenderOpen(!genderOpen)}
          >
            <GenderFilter value={gender} onChange={setGender} />
          </FilterSection>

          {/* Price Range Section */}
          <FilterSection
            title="بازه قیمت (تومان)"
            open={priceOpen}
            onToggle={() => setPriceOpen(!priceOpen)}
          >
            <PriceFilter value={priceRange} onChange={setPriceRange} />
          </FilterSection>

          {/* Colors Section */}
          <FilterSection
            title="رنگ‌ها"
            open={colorsOpen}
            onToggle={() => setColorsOpen(!colorsOpen)}
            mb={activeCount > 0 ? 2 : 0}
          >
            <ColorFilter selected={colors} onToggle={toggleColor} />
          </FilterSection>

          {/* v1.0.0.9: دکمه حذف فیلترها */}
          {activeCount > 0 && (
            <Button
              fullWidth
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={reset}
              sx={{
                mt: 1,
                color: "#B45309",
                borderColor: "#FDE68A",
                backgroundColor: "#FFFBEB",
                fontWeight: 700,
                fontSize: "13px",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#FEF3C7",
                  borderColor: "#F59E0B",
                },
              }}
            >
              حذف فیلترها ({activeCount.toLocaleString("fa-IR")})
            </Button>
          )}
        </Box>
      </ThemeProvider>
    </aside>
  );
}
