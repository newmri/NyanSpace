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

function DrinkEditGoalModal({ open, initialGoalState, onClose, onSave }) {
  const [goalState, setGoalState] = useState({ weight: 0, goal: 0 });
  const [weightError, setWeightError] = useState(false);
  const [goalError, setGoalError] = useState(false);

  useEffect(() => {
    if (open && initialGoalState) {
      setGoalState(initialGoalState);
      setWeightError(false);
      setGoalError(false);
    }
  }, [open, initialGoalState]);

  const handleWeightChange = (e) => {
    const weight = parseFloat(e.target.value);

    if (isNaN(weight) || weight < 0) {
      setWeightError(true);
      setGoalState((prev) => ({
        ...prev,
        weight: e.target.value,
      }));
      return;
    }

    const newGoal = Math.round(weight * 30);
    setWeightError(false);
    setGoalError(newGoal < 1);

    setGoalState((prev) => ({
      weight: weight,
      goal: newGoal,
    }));
  };
  const handleGoalChange = (e) => {
    const goal = parseInt(e.target.value, 10);
    if (isNaN(goal) || goal < 1) {
      setGoalError(true);
      setGoalState((prev) => ({
        ...prev,
        goal: e.target.value,
      }));
      return;
    }
    setGoalError(false);
    setGoalState((prev) => ({
      ...prev,
      goal: goal,
    }));
  };

  const handleSave = () => {
    if (weightError || goalError) return;
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
            error={weightError}
            helperText={weightError ? "0 이상의 숫자를 입력하세요." : ""}
          />
          <TextField
            label="계산된 데일리 목표 (ml)"
            type="number"
            fullWidth
            value={goalState.goal}
            onChange={handleGoalChange}
            inputProps={{ min: 0 }}
            error={goalError}
            helperText={goalError ? "0 이상의 숫자를 입력하세요." : ""}
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
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={weightError || goalError}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DrinkEditGoalModal;
