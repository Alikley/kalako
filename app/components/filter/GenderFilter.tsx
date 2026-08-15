"use client";

import React from "react";
import { Radio, RadioGroup, FormControlLabel, Box } from "@mui/material";
import { FILTER_GENDERS } from "./filterConstants";

interface GenderFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function GenderFilter({ value, onChange }: GenderFilterProps) {
  return (
    <RadioGroup
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
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