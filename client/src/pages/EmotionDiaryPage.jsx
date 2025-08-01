import React, { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const EMOTIONS = [
  { id: 1, label: "excited", emoji: "🤩", color: "#FFECB3" },
  { id: 2, label: "happy", emoji: "😊", color: "#C8E6C9" },
  { id: 3, label: "bored", emoji: "😐", color: "#E0E0E0" },
  { id: 4, label: "tired", emoji: "😩", color: "#B0BEC5" },
  { id: 5, label: "surprised", emoji: "😱", color: "#FFCCBC" },
  { id: 6, label: "sad", emoji: "😞", color: "#90A4AE" },
  { id: 7, label: "angry", emoji: "😡", color: "#EF9A9A" },
];

const diaryEntries = [
  {
    id: 1,
    date: "2025-08-01",
    emotionId: 2,
    text: "5월의 마지막은 정말 좋은날이었어",
  },
  {
    id: 2,
    date: "2025-08-01",
    emotionId: 2,
    text: "오늘 날씨가 아주 좋아서 친구와 다녀왔다.",
  },
  { id: 3, date: "2025-08-01", emotionId: 7, text: "화가 많이 난 하루였다." },
];

export default function EmotionDiaryPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const filteredEntries = diaryEntries.filter((entry) => {
    const entryMonth = new Date(entry.date).getMonth() + 1;
    return entryMonth === month;
  });

  const handlePrev = () => setMonth((m) => (m === 1 ? 12 : m - 1));
  const handleNext = () => setMonth((m) => (m === 12 ? 1 : m + 1));

  return (
    <Box>
      {/* 월 선택 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
          gap: { xs: 0.5, sm: 1.5 },
          flexWrap: "wrap",
        }}
      >
        <IconButton
          onClick={handlePrev}
          aria-label="Previous month"
          size="large"
          sx={{
            "&:hover": { bgcolor: "primary.light", color: "primary.main" },
          }}
        >
          <ChevronLeftIcon fontSize="inherit" />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ minWidth: 100, textAlign: "center" }}
        >
          {new Date().getFullYear()}년 {month}월
        </Typography>

        <IconButton
          onClick={handleNext}
          aria-label="Next month"
          size="large"
          sx={{
            "&:hover": { bgcolor: "primary.light", color: "primary.main" },
          }}
        >
          <ChevronRightIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Button variant="contained" fullWidth sx={{ mb: 3 }}>
        새 일기 쓰기
      </Button>

      {filteredEntries.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          해당 월에 작성된 일기가 없습니다.
        </Typography>
      )}

      {filteredEntries.map((entry) => {
        const emotion = EMOTIONS.find((e) => e.id === entry.emotionId);
        return (
          <Box
            key={entry.id}
            sx={{
              backgroundColor: emotion?.color || "#eee",
              borderRadius: 2,
              p: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              boxShadow: 1,
              transition: "transform 0.1s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 80,
                }}
              >
                <Typography sx={{ fontSize: { xs: 28, sm: 36 } }}>
                  {emotion?.emoji}
                </Typography>
                <Typography sx={{ fontWeight: "bold", mt: 0.5 }}>
                  {entry.date}
                </Typography>
              </Box>

              <Typography sx={{ flex: 1 }}>{entry.text}</Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: { xs: 1, sm: 0 },
                alignSelf: { xs: "flex-end", sm: "auto" },
                whiteSpace: "nowrap",
              }}
            >
              수정하기
            </Button>
          </Box>
        );
      })}
    </Box>
  );
}
