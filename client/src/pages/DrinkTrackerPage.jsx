import React, { useState, useEffect } from "react";
import { useDrinkData } from "../hooks/useDrinkData";
import { Box, Typography } from "@mui/material";
import GoalProgress from "../components/GoalProgress";
import DrinkHistory from "../components/DrinkHistory";
import BottleButtons from "../components/BottleButtons";
import { HISTORY, addHistory, deleteHistory } from "../api/DrinkApi";
import DrinkGoalModal from "../components/DrinkGoalModal";

export default function DrinkTrackerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goalState, setGoalState] = useDrinkData(HISTORY.GOAL);
  const [histories, setHistories] = useDrinkData(HISTORY.DRINK);

  useEffect(() => {
    const totalAmount = histories.reduce((sum, item) => sum + item.amount, 0);
    setCurrentAmount(totalAmount);
  }, [histories]);

  const handleAdd = async (amount) => {
    try {
      const newHistory = await addHistory(HISTORY.DRINK, { amount });
      setHistories((prev) => [...prev, newHistory.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteHistory(HISTORY.DRINK, id);
      setHistories((prev) => prev.filter((history) => history._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveGoal = async (weight, goal) => {
    try {
      await addHistory(HISTORY.GOAL, { weight, goal });
      setGoalState({ weight, goal });
      setModalOpen(false);
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

      <GoalProgress
        current={currentAmount}
        goal={goalState.goal}
        onSettingsClick={() => setModalOpen(true)}
      />

      <DrinkHistory histories={histories} onDelete={handleDelete} />
      <BottleButtons onAdd={handleAdd} />

      <DrinkGoalModal
        open={modalOpen}
        initialGoalState={goalState}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGoal}
      />
    </Box>
  );
}
