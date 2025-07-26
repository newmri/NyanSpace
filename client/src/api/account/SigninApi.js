import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const signin = (email, password) =>
  axios.post(`${API_URL}/account/sign-in`, { email, password });
