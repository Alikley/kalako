"use client";

import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";
import { FILTER_CATEGORIES, FILTER_ALL } from "./filterConstants";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  /**
   * v1.0.3.0: گزینه‌های سفارشی — وقتی کاربر داخل یکی از ۷ دسته‌بندی هست،
   * فقط گزینه‌های همون گروه نمایش داده میشه (کاربر: «هر گزینه باکس فیلتر که
   * کنار محصولات هست طبق اون دسته گزینه هارو نمایش بده»).
   * پیش‌فرض (نامشخص) = کل هشتگ‌ها + «همه»
   */
  options?: string[];
}

/**
 * v1.0.0.9: گزینه «همه» اضافه شد (در استور به‌صورت "" ذخیره می‌شود)
 * و دسته‌ها با داده واقعی بات هماهنگ شدند
 *
 * v1.0.3.0: prop جدید options — حالت دیفعت کل هشتگ‌ها (26 نوع ظریف)،
 * داخل دسته‌بندی فقط زیرمجموعه همون گروه
 */
export function CategoryFilter({ value, onChange, options }: CategoryFilterProps) {
  const handleChange = (v: string) => {
    onChange(v === FILTER_ALL ? "" : v);
  };

  const items = options && options.length > 0 ? options : FILTER_CATEGORIES;

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
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
            },
          },
        }}
      >
        {items.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
