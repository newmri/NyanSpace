import React from "react";
import { Box, Typography, LinearProgress, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function GoalProgress({ current, goal, onSettingsClick }) {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <Box sx={{ my: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">
            오늘의 목표: {current} / {goal}ml
          </Typography>
          <IconButton onClick={onSettingsClick} size="small">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 10, borderRadius: 5 }}
      />
    </Box>
  );
}
