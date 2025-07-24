const express = require("express");
const router = express.Router();
const GoalHistory = require("../../../models/drinktracker/histories/goalhistory");
const { requireSignIn } = require("../../middlewares/auth");

// 기록 조회
router.get("/", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    if (!req.query.date) {
      // date 없으면 최신 기록
      const latest = await GoalHistory.findOne({ account }).sort({ time: -1 });
      return res.json(latest);
    }

    const date = new Date(req.query.date);
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const recordForDate = await GoalHistory.findOne({
      account,
      time: { $gte: start, $lte: end },
    });

    if (recordForDate) {
      return res.json(recordForDate);
    }

    const recordBeforeDate = await GoalHistory.findOne({
      account,
      time: { $lt: start },
    }).sort({ time: -1 });

    return res.json(recordBeforeDate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 범위 기록 조회
router.get("/range", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "start, end 쿼리 필수" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const recordsInRange = await GoalHistory.find({
      account,
      time: { $gte: startDate, $lte: endDate },
    }).sort({ time: 1 });

    const latestBeforeStart = await GoalHistory.findOne({
      account,
      time: { $lt: startDate },
    }).sort({ time: -1 });

    res.json({
      latestBeforeStart,
      recordsInRange,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 추가
router.post("/", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    const { weight, goal } = req.body;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let existingRecord = await GoalHistory.findOne({
      account,
      time: { $gte: todayStart, $lte: todayEnd },
    });

    if (existingRecord) {
      existingRecord.weight = weight;
      existingRecord.goal = goal;
      existingRecord.time = new Date();
      await existingRecord.save();
      return res.json(existingRecord);
    }

    const newRecord = new GoalHistory({
      account,
      weight,
      goal,
      time: new Date(),
    });

    await newRecord.save();
    res.json(newRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
