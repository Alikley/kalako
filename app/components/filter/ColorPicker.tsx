"use client";

import { Box } from "@mui/material";
import { COLORS } from "./filter-theme";

interface ColorPickerProps {
  selected: string[];
  onToggle: (color: string) => void;
}

export function ColorPicker({ selected, onToggle }: ColorPickerProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
      {COLORS.map((c) => {
        const isSelected = selected.includes(c.name);
        return (
          <Box
            key={c.name}
            onClick={() => onToggle(c.name)}
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: c.hex,
              border: isSelected
                ? "2.5px solid #F59E0B"
                : c.hex === "#FFFFFF"
                  ? "1.5px solid #E2E8F0"
                  : "1.5px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                transform: "scale(1.15)",
                borderColor: "#F59E0B",
              },
            }}
            title={c.name}
          />
        );
      })}
    </Box>
  );
}
