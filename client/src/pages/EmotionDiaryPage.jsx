import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formatDateToLocalYYYYMMDD, getDateRange } from "../utils/date";
import {
  EMOTIONS,
  getEmotionDiaries,
} from "../api/EmotionDiary/EmotionDiaryApi";
import { EmotionDiaryModal } from "../components/modals/EmotionDiaryModal";

export default function EmotionDiaryPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [emotionDiaries, setEmotionDiaries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [diaryText, setDiaryText] = useState("");

  const fetchEmotionDiaries = async () => {
    try {
      const { start, end } = getDateRange("month");
      const res = await getEmotionDiaries(start, end);
      setEmotionDiaries(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmotionDiaries();
  }, []);

  function handleSave(text) {
    console.log("선택된 감정:", selectedEmotion);
    console.log("작성된 일기:", text);

    setModalOpen(false);
    setSelectedEmotion(null);
    setDiaryText("");
    fetchEmotionDiaries();
  }

  const filteredEntries = emotionDiaries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === year && entryDate.getMonth() + 1 === month
    );
  });

  const handlePrev = () => {
    setMonth((prev) => {
      if (prev === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setMonth((prev) => {
      if (12 === prev) {
        setYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };

  const handleEdit = (id) => {
    console.log("수정 버튼 클릭됨: ", id);
    // 수정 페이지로 이동 또는 모달 열기 등 구현 가능
  };

  return (
    <>
      {/* 월 선택 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pb: 1,
          gap: { xs: 0.5, sm: 1.5 },
          flexWrap: "wrap",
        }}
      >
        <IconButton
          onClick={handlePrev}
          aria-label="Previous month"
          size="large"
          sx={{
            p: 0,
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
          {year}년 {month}월
        </Typography>

        <IconButton
          onClick={handleNext}
          aria-label="Next month"
          size="large"
          sx={{
            p: 0,
            "&:hover": { bgcolor: "primary.light", color: "primary.main" },
          }}
        >
          <ChevronRightIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mb: 3 }}
        onClick={() => setModalOpen(true)}
      >
        일기 작성
      </Button>

      {filteredEntries.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          해당 월에 작성된 일기가 없습니다.
        </Typography>
      )}

      <EmotionDiaryModal
        emotions={EMOTIONS}
        selected={selectedEmotion}
        onSelect={setSelectedEmotion}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {filteredEntries.map((emotionDiary) => {
        const emotion = EMOTIONS[emotionDiary.emotion];
        return (
          <Box
            key={emotionDiary.id}
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
                  {formatDateToLocalYYYYMMDD(emotionDiary.date)}
                </Typography>
              </Box>

              <Typography sx={{ flex: 1 }}>{emotionDiary.text}</Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: { xs: 1, sm: 0 },
                alignSelf: { xs: "flex-end", sm: "auto" },
                whiteSpace: "nowrap",
              }}
              onClick={() => handleEdit(emotionDiary.id)}
            >
              수정하기
            </Button>
          </Box>
        );
      })}
    </>
  );
}
