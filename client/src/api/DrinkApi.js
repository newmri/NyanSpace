import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

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

export const getHistories = (history, date) => {
  const url = date
    ? `${API_URL}/drinktracker/histories/${history.type}?date=${date}`
    : `${API_URL}/drinktracker/histories/${history.type}`;

  return axios.get(url);
};

export const addHistory = (history, payload) =>
  axios.post(`${API_URL}/drinktracker/histories/${history.type}`, payload);

export const deleteHistory = (history, id) =>
  axios.delete(`${API_URL}/drinktracker/histories/${history.type}/${id}`);
