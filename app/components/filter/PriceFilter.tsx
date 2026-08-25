"use client";

import React from "react";
import { Slider, Box } from "@mui/material";
import { valuetext } from "./filterConstants";
import type { PriceRange } from "@/hook/useFilterStore";

interface PriceFilterProps {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
}

/**
 * v1.0.0.9: تایپ tuple [min, max] — هماهنگ با useFilterStore
 */
export function PriceFilter({ value, onChange }: PriceFilterProps) {
  return (
    <Box sx={{ px: 1 }}>
      <Slider
        getAriaLabel={() => "Price range"}
        value={value}
        onChange={(_, newValue) => onChange(newValue as PriceRange)}
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
          {value[1].toLocaleString("fa-IR")}+
        </Box>
        <Box
          component="span"
          sx={{ fontSize: "11px", color: "#64748B" }}
        >
          {value[0].toLocaleString("fa-IR")}
        </Box>
      </Box>
    </Box>
  );
}