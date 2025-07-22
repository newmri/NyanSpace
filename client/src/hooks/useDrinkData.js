import { useState, useEffect } from "react";
import { getHistories } from "../api/drink/DrinkApi";
import { getTodayDate } from "../utils/date";

export const useDrinkData = (config) => {
  const [data, setData] = useState(config.default);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistories(config, getTodayDate());
        setData(res.data ?? config.default);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [config]);

  return [data, setData];
};
