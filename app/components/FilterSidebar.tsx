"use client";

import React, { useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { muiTheme, FILTER_CATEGORIES } from "./filter/filterConstants";
import { FilterSection } from "./filter/FilterSection";
import { CategoryFilter } from "./filter/CategoryFilter";
import { GenderFilter } from "./filter/GenderFilter";
import { PriceFilter } from "./filter/PriceFilter";
import { ColorFilter } from "./filter/ColorFilter";

export function FilterSidebar() {
  const [selectedCategory, setSelectedCategory] = useState(FILTER_CATEGORIES[0]);
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
          <FilterSection
            title={"\u062f\u0633\u062a\u0647\u200c\u0628\u0646\u062f\u06cc"}
            open={categoryOpen}
            onToggle={() => setCategoryOpen(!categoryOpen)}
          >
            <CategoryFilter
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </FilterSection>

          {/* Gender Section */}
          <FilterSection
            title={"\u062c\u0646\u0633\u06cc\u062a"}
            open={genderOpen}
            onToggle={() => setGenderOpen(!genderOpen)}
          >
            <GenderFilter
              value={selectedGender}
              onChange={setSelectedGender}
            />
          </FilterSection>

          {/* Price Range Section */}
          <FilterSection
            title={"\u0628\u0627\u0632\u0647 \u0642\u06cc\u0645\u062a (\u062a\u0648\u0645\u0627\u0646)"}
            open={priceOpen}
            onToggle={() => setPriceOpen(!priceOpen)}
          >
            <PriceFilter
              value={priceRange}
              onChange={setPriceRange}
            />
          </FilterSection>

          {/* Colors Section */}
          <FilterSection
            title={"\u0631\u0646\u06af\u200c\u0647\u0627"}
            open={colorsOpen}
            onToggle={() => setColorsOpen(!colorsOpen)}
            mb={0}
          >
            <ColorFilter
              selected={selectedColors}
              onToggle={toggleColor}
            />
          </FilterSection>
        </Box>
      </ThemeProvider>
    </aside>
  );
}