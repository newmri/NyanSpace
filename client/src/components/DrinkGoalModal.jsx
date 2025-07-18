import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";

function DrinkGoalModal({ open, initialGoalState, onClose, onSave }) {
  const [goalState, setGoalState] = useState({ weight: 0, goal: 0 });

  useEffect(() => {
    if (open && initialGoalState) {
      setGoalState(initialGoalState);
    }
  }, [open, initialGoalState]);

  const handleWeightChange = (e) => {
    const weight = parseFloat(e.target.value);
    setGoalState((prev) => ({
      weight: weight,
      goal: !isNaN(weight) ? Math.round(weight * 30) : prev.goal,
    }));
  };

  const handleGoalChange = (e) => {
    const goal = parseInt(e.target.value, 10);
    setGoalState((prev) => ({
      ...prev,
      goal: !isNaN(goal) ? goal : prev.goal,
    }));
  };

  const handleSave = () => {
    onSave(goalState.weight, goalState.goal);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        목표량 계산
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="체중 입력 (kg)"
            type="number"
            fullWidth
            value={goalState.weight}
            onChange={handleWeightChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            label="계산된 데일리 목표 (ml)"
            type="number"
            fullWidth
            value={goalState.goal}
            onChange={handleGoalChange}
            inputProps={{ min: 0 }}
            InputProps={{
              endAdornment: (
                <Tooltip title="권장량은 체중 x 30~40ml입니다.">
                  <InfoIcon color="action" />
                </Tooltip>
              ),
            }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary" mt={2}>
          권장량은 체중 x 30~40ml입니다. 필요에 따라 수정하세요.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DrinkGoalModal;
