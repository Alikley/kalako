"use client";

import { Box, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { GENDERS } from "./filter-theme";

interface GenderRadioProps {
  value: string;
  onChange: (val: string) => void;
}

export function GenderRadio({ value, onChange }: GenderRadioProps) {
  return (
    <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
      {GENDERS.map((g) => (
        <FormControlLabel
          key={g}
          value={g}
          control={<Radio size="small" />}
          label={
            <Box component="span" sx={{ fontSize: "13px", color: "#475569" }}>
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
