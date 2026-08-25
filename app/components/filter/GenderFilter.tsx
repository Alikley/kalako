"use client";

import React from "react";
import { Radio, RadioGroup, FormControlLabel, Box } from "@mui/material";
import { FILTER_GENDERS } from "./filterConstants";

interface GenderFilterProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * v1.0.0.9: گزینه «همه» اضافه شد — انتخاب مجدد همان گزینه آن را خاموش می‌کند
 * (toggle رفتار) تا بدون دکمه ریست هم بشود جنسیت را برداشت
 */
export function GenderFilter({ value, onChange }: GenderFilterProps) {
  const handleChange = (v: string) => {
    // کلیک دوباره روی گزینه انتخاب‌شده → حذف انتخاب
    onChange(v === value ? "" : v);
  };

  return (
    <RadioGroup value={value} onChange={(e) => handleChange(e.target.value)}>
      {/* گزینه «همه» */}
      <FormControlLabel
        key="همه"
        value=""
        control={<Radio size="small" />}
        label={
          <Box component="span" sx={{ fontSize: "13px", color: "#475569" }}>
            همه
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
      {FILTER_GENDERS.map((g) => (
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
  );
}
