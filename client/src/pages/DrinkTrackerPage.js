import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import GoalProgress from "../components/GoalProgress";
import DrinkHistory from "../components/DrinkHistory";
import BottleButtons from "../components/BottleButtons";
import { getHistories, addHistory, deleteHistory } from "../api/DrinkApi";

export default function DrinkTrackerPage() {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [histories, setHistories] = useState([]);
  const goalAmount = 2500;

  const fetchHistories = async () => {
    try {
      const res = await getHistories();
      const fetchedHistories = res.data;
      setHistories(fetchedHistories);
      const totalAmount = fetchedHistories.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      setCurrentAmount(totalAmount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const handleAdd = async (amount) => {
    try {
      await addHistory({ amount });
      fetchHistories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteHistory(id);
      fetchHistories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        💧 물 마시기
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        물을 충분히 마셔 건강을 지켜요!
      </Typography>

      <GoalProgress current={currentAmount} goal={goalAmount} />
      <DrinkHistory histories={histories} onDelete={handleDelete} />
      <BottleButtons onAdd={handleAdd} />
    </Box>
  );
}
