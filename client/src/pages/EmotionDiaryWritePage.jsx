import React, { useState } from "react";
import EmotionSelector from "../components/emotionDiary/EmotionSelector";

export const EMOTIONS = [
  { id: 1, label: "excited", emoji: "🤩" },
  { id: 2, label: "happy", emoji: "😊" },
  { id: 3, label: "bored", emoji: "😐" },
  { id: 4, label: "tired", emoji: "😩" },
  { id: 5, label: "surprised", emoji: "😱" },
  { id: 6, label: "sad", emoji: "😞" },
  { id: 7, label: "angry", emoji: "😡" },
];

export default function EmotionDiaryWritePage() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  return (
    <EmotionSelector
      emotions={EMOTIONS}
      selected={selectedEmotion}
      onSelect={setSelectedEmotion}
    />
  );
}
