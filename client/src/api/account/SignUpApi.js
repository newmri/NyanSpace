import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const generateCode = (nickname, email) =>
  axios.post(`${API_URL}/account/signup/generate-code/`, { nickname, email });

export const verifyCode = (uuid, code) =>
  axios.post(`${API_URL}/account/signup/verify-code/`, { uuid, code });

export const signup = (uuid, nickname, email, password) =>
  axios.post(`${API_URL}/account/signup/signup/`, {
    uuid,
    nickname,
    email,
    password,
  });
