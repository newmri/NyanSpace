import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { drinkTypes } from "../../api/DrinkApi";

export default function RecordEditDialog({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount);
    }
  }, [initialData]);

  const handleChangeAmount = (e) => {
    const value = e.target.value;
    setAmount(value);

    // 값이 비었거나 1 이상일 때 에러 없음
    if (value === "" || Number(value) >= 1) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleSave = () => {
    if ("" === amount || Number(amount) < 1) {
      setError(true);
      return;
    }
    onSave({ ...initialData, type, amount: Number(amount) });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>기록 수정</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="음료 종류"
          select
          value={type}
          onChange={(e) => setType(e.target.value)}
          margin="dense"
        >
          {drinkTypes.map((d) => (
            <MenuItem key={d.type} value={d.type}>
              {d.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="양 (ml)"
          type="number"
          value={amount}
          onChange={handleChangeAmount}
          margin="dense"
          error={error}
          helperText={error ? "1 이상의 양수를 입력하세요." : ""}
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} variant="contained">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
