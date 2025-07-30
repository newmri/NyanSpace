import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const searchYoutube = (query) => {
  return axios.get(`${API_URL}/youtube`, {
    params: { query },
  });
};
