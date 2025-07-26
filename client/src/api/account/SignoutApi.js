import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const signout = () => axios.post(`${API_URL}/account/sign-out`);
