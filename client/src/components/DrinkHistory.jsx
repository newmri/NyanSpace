import React from "react";
import { Box, Typography, IconButton, Paper, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {histories.length > 0 ? (
          histories.map((history) => (
            <Paper
              key={history._id}
              elevation={2}
              sx={{
                p: 2,
                pt: 3,
                borderRadius: 2,
                minWidth: 85,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="body1" fontWeight={600}>
                  {formatAmount(history.amount)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.7, fontSize: "0.7rem" }}
                >
                  {formatTime(history.time)}
                </Typography>
              </Stack>
              <IconButton
                size="small"
                onClick={() => onDelete(history._id)}
                sx={{
                  position: "absolute",
                  top: 1,
                  right: 1,
                  color: "primary.contrastText",
                  p: 0.5,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))
        ) : (
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            아직 기록이 없습니다.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
