import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getQuote = () => axios.get(`${API_URL}/quote`);
