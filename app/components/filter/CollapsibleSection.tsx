"use client";

import React from "react";
import { Box, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface CollapsibleSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  sx?: object;
}

export function CollapsibleSection({ title, open, onToggle, children, sx }: CollapsibleSectionProps) {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        <Box component="span" sx={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}>
          {title}
        </Box>
        <IconButton size="small" sx={{ p: 0 }}>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 18, color: "#64748B" }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18, color: "#64748B" }} />
          )}
        </IconButton>
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  );
}
