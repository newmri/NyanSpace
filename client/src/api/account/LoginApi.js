import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const login = (email, password) =>
  axios.post(`${API_URL}/account/login`, { email, password });
