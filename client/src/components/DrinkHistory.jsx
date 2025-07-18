import React from "react";
import { Box, Typography, Chip } from "@mui/material";

const formatAmount = (amount) => {
  if (1000 <= amount) return `${amount / 1000}L`;

  return `${amount}ml`;
};

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DrinkHistory({ histories, onDelete }) {
  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="body2" gutterBottom>
        마신 기록:
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {histories.length > 0 ? (
          histories.map((history) => {
            return (
              <Chip
                key={history._id}
                label={`${formatAmount(history.amount)} (${formatTime(
                  history.time
                )})`}
                onDelete={() => onDelete(history._id)}
                color="primary"
              />
            );
          })
        ) : (
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            아직 기록이 없습니다.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
