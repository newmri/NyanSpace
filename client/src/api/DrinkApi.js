import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getGoal = () => axios.get(`${API_URL}/drinktracker/goal`);

export const saveGoal = (weight, goal) => {
  return axios.post(`${API_URL}/drinktracker/goal`, { weight, goal });
};

export const getHistories = () =>
  axios.get(`${API_URL}/drinktracker/histories`);

export const addHistory = (amount) =>
  axios.post(`${API_URL}/drinktracker/histories`, amount);

export const deleteHistory = (id) =>
  axios.delete(`${API_URL}/drinktracker/histories/${id}`);
