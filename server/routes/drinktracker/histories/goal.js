const express = require("express");
const router = express.Router();
const GoalHistory = require("../../../models/drinktracker/histories/goalhistory");
const { requireSignIn } = require("../../middlewares/auth");
const { parseDateRange, getTodayDate } = require("../../../utils/date");

// 기록 조회
router.get("/", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    if (!req.query.date) {
      // date 없으면 최신 기록
      const latest = await GoalHistory.findOne({ account }).sort({ time: -1 });
      return res.json(latest);
    }

    const range = parseDateRange(req.query.date, req.query.date);

    const recordForDate = await GoalHistory.findOne({
      account,
      time: { $gte: range.startDate, $lte: range.endDate },
    });

    if (recordForDate) {
      return res.json(recordForDate);
    }

    const recordBeforeDate = await GoalHistory.findOne({
      account,
      time: { $lt: range.startDate },
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
    const range = parseDateRange(start, end);

    const recordsInRange = await GoalHistory.find({
      account,
      time: { $gte: range.startDate, $lte: range.endDate },
    }).sort({ time: 1 });

    const latestBeforeStart = await GoalHistory.findOne({
      account,
      time: { $lt: range.startDate },
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

    const todayDate = getTodayDate();
    const range = parseDateRange(todayDate, todayDate);

    let existingRecord = await GoalHistory.findOne({
      account,
      time: { $gte: range.startDate, $lte: range.endDate },
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
