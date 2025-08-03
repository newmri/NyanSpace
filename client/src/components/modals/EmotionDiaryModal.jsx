import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmotionSelector from "../emotionDiary/EmotionSelector";

export function EmotionDiaryModal({
  emotions,
  selected,
  onSelect,
  open,
  onClose,
  onSave,
  initialText = "",
}) {
  const [text, setText] = useState(initialText);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open) {
      setText(initialText);
    }
  }, [open, initialText]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        일기 작성
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <EmotionSelector
          emotions={emotions}
          selected={selected}
          onSelect={onSelect}
        />
        <TextField
          multiline
          rows={2}
          label="오늘의 감정과 이유를 기록해보세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          onKeyDown={(e) => {
            if ("Enter" === e.key && !e.shiftKey) {
              e.preventDefault();
              if (selected && "" !== text.trim()) {
                onSave(text);
              }
            }
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          px: 3,
          pb: 2,
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth={fullScreen}
          sx={{ flex: 1, minWidth: 0 }}
        >
          취소
        </Button>
        <Button
          onClick={() => onSave(text)}
          variant="contained"
          disabled={!selected || text.trim() === ""}
          fullWidth={fullScreen}
          sx={{ flex: 1, minWidth: 0 }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
