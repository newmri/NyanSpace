import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const generateCode = (email) =>
  axios.post(`${API_URL}/account/reset-password/generate-code/`, {
    email,
  });

export const verifyCode = (uuid, code) =>
  axios.post(`${API_URL}/account/reset-password/verify-code/`, { uuid, code });

export const resetPassword = (uuid, email, password) =>
  axios.post(`${API_URL}/account/reset-password/`, {
    uuid,
    email,
    password,
  });
