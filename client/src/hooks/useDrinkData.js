import { useState, useEffect } from "react";
import { getHistories } from "../api/drink/DrinkApi";
import { getTodayDate } from "../utils/date";
import { useNotification } from "../components/Notification";

export const useDrinkData = (config) => {
  const [data, setData] = useState(config.default);

  const { showMessage } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistories(config, getTodayDate());
        setData(res.data ?? config.default);
      } catch (err) {
        showMessage.error(err, "error");
      }
    };
    fetchData();
  }, [config]);

  return [data, setData];
};
