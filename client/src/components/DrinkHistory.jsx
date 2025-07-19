import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatTime } from "../utils/date";
import { drinkTypes } from "../api/DrinkApi";

// 용량 포맷 함수
const formatAmount = (amount) => {
  return amount >= 1000 ? `${amount / 1000}L` : `${amount}ml`;
};

export default function DrinkHistory({ histories, onEdit, onDelete }) {
  return (
    <Box sx={{ my: 3 }}>
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
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                minWidth: 95,
                maxWidth: 120,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
              }}
            >
              <Stack spacing={0.5} flexGrow={1}>
                <Typography variant="body1" fontWeight={600}>
                  {formatAmount(history.amount)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {drinkTypes.find((type) => type.type === history.type)
                    ?.label || "기타"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  {formatTime(history.time)}
                </Typography>
              </Stack>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  mt: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onEdit(history)}
                  sx={{ p: 0.5 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(history._id)}
                  sx={{ p: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
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
