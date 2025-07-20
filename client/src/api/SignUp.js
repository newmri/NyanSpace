import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const sendEmailVerificationCode = (nickname, email) =>
  axios.post(`${API_URL}/signup/verification-code/`, { nickname, email });
