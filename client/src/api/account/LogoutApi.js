import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const logout = () => axios.post(`${API_URL}/account/logout`);
