import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

export default function GoalProgress({ current, goal }) {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="body1" gutterBottom>
        오늘의 목표: {current} / {goal}ml
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 10, borderRadius: 5 }}
      />
    </Box>
  );
}
