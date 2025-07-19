const express = require("express");
const router = express.Router();
const GoalHistory = require("../../../models/drinktracker/histories/goalhistory");

// 기록 조회
router.get("/", async (req, res) => {
  try {
    if (!req.query.date) {
      // date 없으면 그냥 최신 기록 하나 리턴
      const latest = await GoalHistory.findOne().sort({ time: -1 });
      return res.json(latest);
    }

    const date = new Date(req.query.date);
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // 요청한 날짜에 해당하는 기록 찾기
    const recordForDate = await GoalHistory.findOne({
      time: { $gte: start, $lte: end },
    });

    // 있으면 리턴
    if (recordForDate) {
      return res.json(recordForDate);
    }

    // 없으면 그 이전 날짜 중 최신 기록 찾기
    const recordBeforeDate = await GoalHistory.findOne({
      time: { $lt: start },
    }).sort({ time: -1 });

    return res.json(recordBeforeDate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 추가
router.post("/", async (req, res) => {
  const { weight, goal } = req.body;
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 오늘 날짜 범위 안에 있는 기록을 찾음
    let existingRecord = await GoalHistory.findOne({
      time: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingRecord) {
      // 있으면 업데이트
      existingRecord.weight = weight;
      existingRecord.goal = goal;
      existingRecord.time = new Date();
      await existingRecord.save();
      res.json(existingRecord);
    } else {
      // 없으면 새로 생성
      const newRecord = new GoalHistory({
        weight,
        goal,
        time: new Date(),
      });
      await newRecord.save();
      res.json(newRecord);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
