import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getItems = () => axios.get(`${API_URL}/items`);
export const addItem = (name) => axios.post(`${API_URL}/items`, { name });
