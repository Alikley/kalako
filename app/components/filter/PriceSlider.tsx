"use client";

import { useState } from "react";
import { Box, Slider } from "@mui/material";

function valuetext(value: number) {
  return value.toLocaleString("fa-IR");
}

interface PriceSliderProps {
  value: number[];
  onChange: (val: number[]) => void;
}

export function PriceSlider({ value, onChange }: PriceSliderProps) {
  return (
    <Box sx={{ px: 1 }}>
      <Slider
        getAriaLabel={() => "Price range"}
        value={value}
        onChange={(_, newValue) => onChange(newValue as number[])}
        min={100000}
        max={10000000}
        step={100000}
        valueLabelDisplay="auto"
        valueLabelFormat={valuetext}
        disableSwap
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
        <Box component="span" sx={{ fontSize: "11px", color: "#64748B" }}>
          {value[1].toLocaleString("fa-IR")}+
        </Box>
        <Box component="span" sx={{ fontSize: "11px", color: "#64748B" }}>
          {value[0].toLocaleString("fa-IR")}
        </Box>
      </Box>
    </Box>
  );
}
