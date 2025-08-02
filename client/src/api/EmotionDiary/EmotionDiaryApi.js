import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const EMOTIONS = {
  EXCITED: { emoji: "🤩", color: "#FFECB3" },
  HAPPY: { emoji: "😊", color: "#C8E6C9" },
  BORED: { emoji: "😐", color: "#E0E0E0" },
  TIRED: { emoji: "😩", color: "#B0BEC5" },
  SURPRISED: { emoji: "😱", color: "#FFCCBC" },
  SAD: { emoji: "😞", color: "#90A4AE" },
  ANGRY: { emoji: "😡", color: "#EF9A9A" },
};

export const getEmotionDiaries = (start, end) => {
  return axios.get(`${API_URL}/emotiondiary`, {
    params: { start, end },
  });
};
