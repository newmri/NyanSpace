import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formatDateToLocalYYYYMMDD, getDateRange } from "../utils/date";
import {
  saveEmotionDiary,
  EMOTIONS,
  getEmotionDiaries,
} from "../api/EmotionDiary/EmotionDiaryApi";
import { EmotionDiaryModal } from "../components/modals/EmotionDiaryModal";

export default function EmotionDiaryPage() {
  const [date, setDate] = useState(new Date());
  const [emotionDiaries, setEmotionDiaries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [diaryText, setDiaryText] = useState("");

  const fetchEmotionDiaries = async () => {
    try {
      const { start, end } = getDateRange("month", date);
      const res = await getEmotionDiaries(start, end);

      setEmotionDiaries(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmotionDiaries();
  }, [date]);

  const handleSave = async (text) => {
    try {
      const newEmotionDiary = await saveEmotionDiary(emotion, text);

      setEmotionDiaries((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex(
          (d) =>
            d.id === newEmotionDiary.data.id ||
            d._id === newEmotionDiary.data._id
        );

        if (-1 !== idx) {
          updated[idx] = newEmotionDiary.data; // 기존 항목 덮어쓰기
        } else {
          updated.push(newEmotionDiary.data); // 새 항목 추가
        }

        return updated;
      });

      setModalOpen(false);
      setEmotion(null);
      setDiaryText("");
    } catch (err) {
      console.error(err.message);
    }
  };

  const handlePrev = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNext = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleEdit = (id) => {
    const diary = emotionDiaries.find((d) => d.id === id);
    if (!diary) return;

    setEmotion(diary.emotion);
    setDiaryText(diary.text);
    setModalOpen(true);
  };

  const handleWriteClick = () => {
    const todayStr = formatDateToLocalYYYYMMDD(new Date());
    const existingToday = emotionDiaries.find(
      (d) => formatDateToLocalYYYYMMDD(new Date(d.time)) === todayStr
    );

    if (existingToday) {
      if (window.confirm("오늘 일기를 이미 작성했어요. 수정하시겠어요?")) {
        setEmotion(existingToday.emotion);
        setDiaryText(existingToday.text);
        setModalOpen(true);
      }
    } else {
      setEmotion(null);
      setDiaryText("");
      setModalOpen(true);
    }
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
          {date.getFullYear()}년 {date.getMonth() + 1}월
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
        onClick={handleWriteClick}
      >
        일기 작성
      </Button>

      {emotionDiaries.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          해당 월에 작성된 일기가 없습니다.
        </Typography>
      )}

      <EmotionDiaryModal
        emotions={EMOTIONS}
        selected={emotion}
        onSelect={setEmotion}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEmotion(null);
          setDiaryText("");
        }}
        onSave={handleSave}
        initialText={diaryText}
      />

      {emotionDiaries.map((emotionDiary) => {
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
                  {formatDateToLocalYYYYMMDD(new Date(emotionDiary.time))}
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
