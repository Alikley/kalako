"use client";

import { useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { muiTheme, CATEGORIES } from "./filter/filter-theme";
import { CollapsibleSection } from "./filter/CollapsibleSection";
import { CategorySelect } from "./filter/CategorySelect";
import { GenderRadio } from "./filter/GenderRadio";
import { PriceSlider } from "./filter/PriceSlider";
import { ColorPicker } from "./filter/ColorPicker";

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <FilterListIcon sx={{ color: "#1E293B", fontSize: 22 }} />
            <Box component="span" sx={{ fontSize: "16px", fontWeight: 700, color: "#1E293B" }}>
              {"\u0641\u06cc\u0644\u062a\u0631\u0647\u0627"}
            </Box>
          </Box>

          <CollapsibleSection title={"\u062f\u0633\u062a\u0647\u200c\u0628\u0646\u062f\u06cc"} open={categoryOpen} onToggle={() => setCategoryOpen(!categoryOpen)}>
            <CategorySelect value={selectedCategory} onChange={setSelectedCategory} />
          </CollapsibleSection>

          <CollapsibleSection title={"\u062c\u0646\u0633\u06cc\u062a"} open={genderOpen} onToggle={() => setGenderOpen(!genderOpen)}>
            <GenderRadio value={selectedGender} onChange={setSelectedGender} />
          </CollapsibleSection>

          <CollapsibleSection title={"\u0628\u0627\u0632\u0647 \u0642\u06cc\u0645\u062a (\u062a\u0648\u0645\u0627\u0646)"} open={priceOpen} onToggle={() => setPriceOpen(!priceOpen)}>
            <PriceSlider value={priceRange} onChange={setPriceRange} />
          </CollapsibleSection>

          <CollapsibleSection title={"\u0631\u0646\u06af\u200c\u0647\u0627"} open={colorsOpen} onToggle={() => setColorsOpen(!colorsOpen)} sx={{ mb: 0 }}>
            <ColorPicker selected={selectedColors} onToggle={toggleColor} />
          </CollapsibleSection>
        </Box>
      </ThemeProvider>
    </aside>
  );
}
