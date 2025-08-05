import React, { useState, useEffect } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formatDateToLocalYYYYMMDD, getDateRange } from "../utils/date";
import {
  EMOTIONS,
  getEmotionDiaries,
  createEmotionDiary,
  updateEmotionDiary,
  deleteEmotionDiary,
} from "../api/EmotionDiary/EmotionDiaryApi";
import { EmotionDiaryModal } from "../components/modals/EmotionDiaryModal";
import { useNotification } from "../components/Notification";

export default function EmotionDiaryPage() {
  const [date, setDate] = useState(new Date());
  const [emotionDiaries, setEmotionDiaries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [diaryText, setDiaryText] = useState("");
  const [editId, setEditId] = useState(null);

  const { showMessage } = useNotification();

  const fetchEmotionDiaries = async () => {
    try {
      const { start, end } = getDateRange("month", date);
      const res = await getEmotionDiaries(start, end);

      setEmotionDiaries(res.data);
    } catch (err) {
      showMessage(err, "error");
    }
  };

  useEffect(() => {
    fetchEmotionDiaries();
  }, [date]);

  const handleSave = async (text) => {
    try {
      if (editId) {
        const response = await updateEmotionDiary(editId, emotion, text);
        setEmotionDiaries((prev) => {
          return prev.map((diary) =>
            diary._id === editId ? response.data : diary
          );
        });
      } else {
        const response = await createEmotionDiary(emotion, text);

        setEmotionDiaries((prev) => {
          const updated = [...prev];
          updated.push(response.data);
          return updated;
        });
      }

      setModalOpen(false);
      setEmotion(null);
      setDiaryText("");
      setEditId(null);
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("정말 삭제하시겠어요?");
    if (!confirmed) return;

    try {
      await deleteEmotionDiary(id);
      setEmotionDiaries((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      showMessage("삭제 중 오류가 발생했습니다.", "error");
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
    const diary = emotionDiaries.find((d) => d._id === id);
    if (!diary) return;

    setEditId(id);
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
        setEditId(existingToday._id);
      }
    } else {
      setEmotion(null);
      setDiaryText("");
      setModalOpen(true);
      setEditId(null);
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
          setEditId(null);
        }}
        onSave={handleSave}
        initialText={diaryText}
      />

      {emotionDiaries.map((emotionDiary) => {
        const emotion = EMOTIONS[emotionDiary.emotion];
        return (
          <Box
            key={emotionDiary._id}
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
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: { xs: 1, sm: 0 },
                alignSelf: { xs: "flex-end", sm: "auto" },
              }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{ whiteSpace: "nowrap" }}
                onClick={() => handleEdit(emotionDiary._id)}
              >
                수정하기
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ whiteSpace: "nowrap" }}
                onClick={() => handleDelete(emotionDiary._id)}
              >
                삭제하기
              </Button>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
