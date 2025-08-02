import React from "react";
import { Box, IconButton, Avatar, Tooltip } from "@mui/material";

export default function EmotionSelector({ emotions, selected, onSelect }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: { xs: "center", sm: "flex-start" },
        alignItems: "center",
      }}
    >
      {Object.entries(emotions).map(([id, emotion]) => {
        const selectedItem = selected === id;

        return (
          <Tooltip key={id} title={emotion.label} arrow>
            <IconButton
              onClick={() => onSelect(id)}
              sx={{ padding: 0 }}
              aria-label={`${emotion.label} 선택`}
            >
              <Avatar
                sx={{
                  width: { xs: 30, sm: 52, md: 60 },
                  height: { xs: 30, sm: 52, md: 60 },
                  fontSize: { xs: 20, sm: 37, md: 45 },
                  bgcolor: selectedItem ? "primary.main" : "transparent",
                  color: selectedItem ? "white" : "black",
                  border: selectedItem ? "2px solid" : "1px solid",
                  borderColor: selectedItem ? "primary.main" : "grey.300",
                  transition: "all 0.3s ease",
                }}
              >
                {emotion.emoji}
              </Avatar>
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
}
