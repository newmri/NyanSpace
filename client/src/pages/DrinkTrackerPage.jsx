import React, { useState, useEffect } from "react";
import { useDrinkData } from "../hooks/useDrinkData";
import { Typography } from "@mui/material";
import GoalProgress from "../components/GoalProgress";
import DrinkHistory from "../components/DrinkHistory";
import BottleButtons from "../components/BottleButtons";
import {
  HISTORY,
  addHistory,
  updateHistory,
  deleteHistory,
} from "../api/DrinkApi";
import DrinkEditGoalModal from "../components/DrinkEditGoalModal";
import DrinkEditHistoryModal from "../components/DrinkEditHistoryModal";

export default function DrinkTrackerPage() {
  const [editGoalModalOpen, setEditGoalModalOpen] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goalState, setGoalState] = useDrinkData(HISTORY.GOAL);
  const [histories, setHistories] = useDrinkData(HISTORY.DRINK);
  const [editHistoryModalOpen, setEditHistoryModalOpen] = useState(false);
  const [editHistoryTarget, setEditHistoryTarget] = useState(null);

  useEffect(() => {
    const totalAmount = histories.reduce((sum, item) => sum + item.amount, 0);
    setCurrentAmount(totalAmount);
  }, [histories]);

  const handleAdd = async (type, amount) => {
    try {
      console.log(type);
      const newHistory = await addHistory(HISTORY.DRINK, { type, amount });
      setHistories((prev) => [...prev, newHistory.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditHistory = (history) => {
    setEditHistoryTarget(history);
    setEditHistoryModalOpen(true);
  };

  const handleSaveEditHistory = async (updated) => {
    try {
      const result = await updateHistory(HISTORY.DRINK, updated._id, {
        type: updated.type,
        amount: updated.amount,
      });

      setHistories((prev) =>
        prev.map((history) =>
          history._id === updated._id ? result.data : history
        )
      );
      setEditHistoryModalOpen(false);
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
      setEditGoalModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        💧 물 마시기
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        물을 충분히 마셔 건강을 지켜요!
      </Typography>

      <GoalProgress
        current={currentAmount}
        goal={goalState.goal}
        onSettingsClick={() => setEditGoalModalOpen(true)}
      />

      <DrinkHistory
        histories={histories}
        onEdit={handleEditHistory}
        onDelete={handleDelete}
      />
      <BottleButtons onAdd={handleAdd} />

      <DrinkEditGoalModal
        open={editGoalModalOpen}
        initialGoalState={goalState}
        onClose={() => setEditGoalModalOpen(false)}
        onSave={handleSaveGoal}
      />
      <DrinkEditHistoryModal
        open={editHistoryModalOpen}
        onClose={() => setEditHistoryModalOpen(false)}
        onSave={handleSaveEditHistory}
        initialData={editHistoryTarget}
      />
    </>
  );
}
