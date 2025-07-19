import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { drinkTypes } from "../api/DrinkApi";

export default function DrinkEditHistoryModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount);
    }
  }, [initialData]);

  const handleSubmit = () => {
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
          onChange={(e) => setAmount(e.target.value)}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
