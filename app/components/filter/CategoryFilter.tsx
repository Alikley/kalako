"use client";

import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { FILTER_CATEGORIES, FILTER_ALL } from "./filterConstants";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * v1.0.0.9: گزینه «همه» اضافه شد (در استور به‌صورت "" ذخیره می‌شود)
 * و دسته‌ها با داده واقعی بات هماهنگ شدند
 */
export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const handleChange = (v: string) => {
    onChange(v === FILTER_ALL ? "" : v);
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
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
