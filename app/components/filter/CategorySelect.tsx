"use client";

import { Box, FormControl, Select, MenuItem } from "@mui/material";
import { CATEGORIES } from "./filter-theme";

interface CategorySelectProps {
  value: string;
  onChange: (val: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
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
        {CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
