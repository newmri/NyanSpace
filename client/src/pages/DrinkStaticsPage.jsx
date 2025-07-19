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
import { HISTORY, drinkTypes, getHistoriesInRange } from "../api/DrinkApi";
import { getDateRange } from "../utils/date";

export default function DrinkStaticsPage() {
  const [viewMode, setViewMode] = useState("week");
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { start, end } = getDateRange(viewMode);
        if (!start || !end) return;

        const [drinkRes, goalRes] = await Promise.all([
          getHistoriesInRange(HISTORY.DRINK, start, end),
          getHistoriesInRange(HISTORY.GOAL, start, end),
        ]);

        const drinks = drinkRes.data; // [{ type, amount, time }]
        const { latestBeforeStart, recordsInRange } = goalRes.data;

        // 1) 기간 내 goal 기록 + 기간 이전 최신 goal 기록 합치기
        const allGoals = [];

        if (latestBeforeStart) {
          allGoals.push(latestBeforeStart);
        }
        allGoals.push(...recordsInRange);

        // 2) 요청 날짜 범위 모든 날짜 배열 생성
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

        // 3) goal 기록을 날짜 문자열(key)별 맵으로 만듦
        const goalsByDate = {};
        allGoals.forEach(({ time, goal, weight }) => {
          const dateStr = new Date(time).toISOString().slice(0, 10);
          goalsByDate[dateStr] = { goal, weight };
        });

        // 4) 누락된 날짜 보간
        const resultGoals = [];
        let lastKnownGoal = null;
        dateList.forEach((dateObj) => {
          const dateStr = dateObj.toISOString().slice(0, 10);
          if (goalsByDate[dateStr]) {
            lastKnownGoal = goalsByDate[dateStr];
            resultGoals.push({ ...lastKnownGoal, time: dateObj });
          } else if (lastKnownGoal) {
            // 이전 known goal을 복사해서 시간만 현재 날짜로 바꿈
            resultGoals.push({ ...lastKnownGoal, time: dateObj });
          } else {
            // 초기값 없으면 기본값 넣기
            resultGoals.push({ goal: 0, weight: 0, time: dateObj });
          }
        });

        // 5) drinks 데이터 기준으로 날짜별 음료량 합산 준비
        const merged = {};
        dateList.forEach((dateObj) => {
          const dateStr = dateObj.toISOString().slice(0, 10);
          merged[dateStr] = { date: dateStr, goal: 0 };
          drinkTypes.forEach(({ type }) => {
            merged[dateStr][type] = 0;
          });
        });

        // 6) 보간한 goal 기록 반영
        resultGoals.forEach(({ time, goal, weight }) => {
          const dateStr = new Date(time).toISOString().slice(0, 10);
          if (merged[dateStr]) {
            merged[dateStr].goal = goal;
            merged[dateStr].weight = weight;
          }
        });

        // 7) 음료 기록 병합
        drinks.forEach(({ time, type, amount }) => {
          const dateStr = new Date(time).toISOString().slice(0, 10);
          if (!merged[dateStr]) return;
          if (drinkTypes.find((d) => d.type === type)) {
            merged[dateStr][type] += amount;
          }
        });

        console.log(merged);
        setRawData(Object.values(merged));
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };

    fetchData();
  }, [viewMode]);
  const handleModeChange = (_, newMode) => {
    if (newMode !== null) setViewMode(newMode);
  };

  const chartData = useMemo(() => {
    // groupByKey 함수: period별 그룹화 기준
    const groupByKey = (date) => {
      const d = new Date(date);
      if ("year" === viewMode) return d.getFullYear().toString();
      if ("month" === viewMode)
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      if ("week" === viewMode) {
        const week = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
        return `${d.getFullYear()}.W${week}`;
      }
      return date;
    };

    const grouped = {};
    rawData.forEach((entry) => {
      const key = groupByKey(entry.date);
      if (!grouped[key]) {
        grouped[key] = { period: key, goal: 0 };
        drinkTypes.forEach(({ type }) => {
          grouped[key][type] = 0;
        });
      }
      grouped[key].goal += entry.goal;
      drinkTypes.forEach(({ type }) => {
        grouped[key][type] += entry[type] || 0;
      });
    });

    return Object.values(grouped).map(({ period, goal, ...drinks }) => {
      const total = drinkTypes.reduce(
        (sum, { type }) => sum + (drinks[type] || 0),
        0
      );
      const rate = goal > 0 ? total / goal : 0;

      const percentData = {};
      drinkTypes.forEach(({ type }) => {
        percentData[`${type}Percent`] =
          total > 0 ? ((drinks[type] || 0) / total) * rate : 0;
      });

      return {
        period,
        totalRate: rate,
        ...percentData,
      };
    });
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
