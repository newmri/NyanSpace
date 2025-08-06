import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  HISTORY,
  drinkTypes,
  getHistoriesInRange,
} from "../api/drink/DrinkApi";
import {
  getDateRange,
  formatDateToLocalYYYYMMDD,
  getMonthWeekNumber,
} from "../utils/date";
import { useNotification } from "../components/Notification";

export default function DrinkStaticsPage() {
  const [viewMode, setViewMode] = useState("week");
  const [rawData, setRawData] = useState([]);

  const { showMessage } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { start, end } = getDateRange(viewMode);
        if (!start || !end) return;

        const [drinkRes, goalRes] = await Promise.all([
          getHistoriesInRange(HISTORY.DRINK, start, end),
          getHistoriesInRange(HISTORY.GOAL, start, end),
        ]);

        const drinks = drinkRes.data;
        const { latestBeforeStart, recordsInRange } = goalRes.data;

        const allGoals = [];
        if (latestBeforeStart) {
          const isDuplicate = recordsInRange.some(
            (rec) =>
              formatDateToLocalYYYYMMDD(new Date(rec.time)) ===
              formatDateToLocalYYYYMMDD(new Date(latestBeforeStart.time))
          );
          if (!isDuplicate) {
            allGoals.push(latestBeforeStart);
          }
        }
        allGoals.push(...recordsInRange);

        console.log(allGoals);
        // 날짜 리스트 만들기
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateList = [];
        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          dateList.push(new Date(d));
        }

        // goal 시간순 정렬 후 날짜별로 가장 최근 goal 찾기
        const sortedGoals = [...allGoals].sort(
          (a, b) => new Date(a.time) - new Date(b.time)
        );

        const resultGoals = [];
        let goalIndex = 0;
        let lastKnownGoal = { goal: 0, weight: 0 };

        dateList.forEach((dateObj) => {
          const currentDate = new Date(formatDateToLocalYYYYMMDD(dateObj));

          while (
            goalIndex < sortedGoals.length &&
            new Date(sortedGoals[goalIndex].time) <= currentDate
          ) {
            lastKnownGoal = {
              goal: sortedGoals[goalIndex].goal,
              weight: sortedGoals[goalIndex].weight,
            };
            goalIndex++;
          }

          resultGoals.push({ ...lastKnownGoal, time: currentDate });
        });

        // 날짜별 병합 데이터 구조 초기화
        const merged = {};
        dateList.forEach((dateObj) => {
          const dateStr = formatDateToLocalYYYYMMDD(dateObj);
          merged[dateStr] = { date: dateStr, goal: 0 };
          drinkTypes.forEach(({ type }) => {
            merged[dateStr][type] = 0;
          });
        });

        // 보간된 goal 반영
        resultGoals.forEach(({ time, goal, weight }) => {
          const dateStr = formatDateToLocalYYYYMMDD(new Date(time));
          if (merged[dateStr]) {
            merged[dateStr].goal = goal;
            merged[dateStr].weight = weight;
          }
        });

        // 음료 데이터 반영
        drinks.forEach(({ time, type, amount }) => {
          const dateStr = formatDateToLocalYYYYMMDD(new Date(time));
          if (!merged[dateStr]) return;
          if (drinkTypes.find((d) => d.type === type)) {
            merged[dateStr][type] += amount;
          }
        });

        setRawData(Object.values(merged));
        console.log(Object.values(merged));
      } catch (error) {
        showMessage("데이터 로딩 실패", "error");
      }
    };

    fetchData();
  }, [viewMode]);

  const handleModeChange = (_, newMode) => {
    if (newMode !== null) setViewMode(newMode);
  };

  const chartData = useMemo(() => {
    const groupByKey = (date) => {
      const d = new Date(date);
      if ("year" === viewMode) return d.getFullYear().toString();
      if ("month" === viewMode)
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      if ("week" === viewMode) {
        const week = getMonthWeekNumber(d);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )} ${week}주차`;
      }
      return date;
    };

    const grouped = {};
    rawData.forEach((entry) => {
      const key = groupByKey(entry.date);
      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          goalSum: 0,
          drinkSum: 0,
        };
        drinkTypes.forEach(({ type }) => {
          grouped[key][type] = 0;
        });
      }

      grouped[key].goalSum += entry.goal;

      drinkTypes.forEach(({ type }) => {
        grouped[key][type] += entry[type] || 0;
        grouped[key].drinkSum += entry[type] || 0;
      });
    });

    return Object.values(grouped).map(
      ({ period, goalSum, drinkSum, ...drinks }) => {
        const rate = goalSum > 0 ? drinkSum / goalSum : 0;

        const percentData = {};
        drinkTypes.forEach(({ type }) => {
          percentData[`${type}Percent`] =
            drinkSum > 0 ? (drinks[type] / drinkSum) * rate : 0;
        });

        return {
          period,
          totalRate: rate,
          ...percentData,
        };
      }
    );
  }, [rawData, viewMode]);

  return (
    <Box>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleModeChange}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="week">주간</ToggleButton>
        <ToggleButton value="month">월간</ToggleButton>
        <ToggleButton value="year">연간</ToggleButton>
      </ToggleButtonGroup>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="period" />
            <YAxis
              domain={[0, "dataMax"]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            />
            <Tooltip
              formatter={(v) => `${(v * 100).toFixed(1)}%`}
              labelFormatter={(label) => `기간: ${label}`}
            />
            <Legend />
            {drinkTypes.map(({ type, label, color }) => (
              <Bar
                key={type}
                dataKey={`${type}Percent`}
                stackId="a"
                fill={color}
                name={label}
              />
            ))}
            <ReferenceLine
              y={1}
              stroke="red"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: "100% 목표",
                position: "top",
                fill: "red",
                fontSize: 14,
                fontWeight: "bold",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Box>
  );
}
