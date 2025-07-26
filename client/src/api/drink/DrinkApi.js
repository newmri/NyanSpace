import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const HISTORY = {
  DRINK: {
    type: "drink",
    default: [],
  },
  GOAL: {
    type: "goal",
    default: { weight: 0, goal: 2000 },
  },
};

export const DRINK = {
  WATER: {
    type: "water",
    label: "물 💧",
    color: "#00BFFF",
  },
  COFFEE: {
    type: "coffee",
    label: "커피 ☕",
    color: "#6F4E37",
  },
  SODA: {
    type: "soda",
    label: "탄산 🥤",
    color: "#FF6F00",
  },
  TEA: {
    type: "tea",
    label: "차 🍵",
    color: "#228B22",
  },
};

export const drinkTypes = Object.values(DRINK);

export const getHistories = (history, date) => {
  const url = date
    ? `${API_URL}/drinktracker/histories/${history.type}?date=${date}`
    : `${API_URL}/drinktracker/histories/${history.type}`;

  return axios.get(url);
};

export const getHistoriesInRange = (history, start, end) => {
  return axios.get(`${API_URL}/drinktracker/histories/${history.type}/range`, {
    params: { start, end },
  });
};

export const addHistory = (history, payload) =>
  axios.post(`${API_URL}/drinktracker/histories/${history.type}`, payload);

export const updateHistory = (history, id, payload) =>
  axios.put(`${API_URL}/drinktracker/histories/${history.type}/${id}`, payload);

export const deleteHistory = (history, id) =>
  axios.delete(`${API_URL}/drinktracker/histories/${history.type}/${id}`);
