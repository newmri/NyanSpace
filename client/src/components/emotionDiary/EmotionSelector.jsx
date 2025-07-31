import React from "react";
import { Box, IconButton, Avatar } from "@mui/material";

export default function EmotionSelector({ emotions, selected, onSelect }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {emotions.map((emotion) => {
        const selectedItem = selected === emotion.id;
        return (
          <IconButton
            key={emotion.id}
            sx={{ padding: 0 }}
            onClick={() => onSelect(emotion.id)}
          >
            <Avatar
              sx={{
                width: { xs: 33, sm: 52, md: 60, lg: 90, xl: 110 },
                height: { xs: 33, sm: 52, md: 60, lg: 90, xl: 110 },
                fontSize: { xs: 23, sm: 37, md: 45, lg: 65, xl: 80 },
                bgcolor: selectedItem ? "primary.main" : "transparent",
                color: selectedItem ? "white" : "black",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              {emotion.emoji}
            </Avatar>
          </IconButton>
        );
      })}
    </Box>
  );
}
