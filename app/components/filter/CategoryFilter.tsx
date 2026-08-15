"use client";

import React from "react";
import { FormControl, Select, MenuItem, Box } from "@mui/material";
import { FILTER_CATEGORIES } from "./filterConstants";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <FormControl fullWidth size="small">
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          borderRadius: "12px",
          backgroundColor: "#F1F5F9",
          "& .MuiSelect-icon": { color: "#94A3B8" },
          "&:hover": { backgroundColor: "#E2E8F0" },
        }}
      >
        {FILTER_CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}