const express = require("express");
const router = express.Router();
const History = require("../../models/drinktracker/history");

// 기록 조회
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.date) {
      const date = new Date(req.query.date);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.time = { $gte: start, $lte: end };
    }

    const histories = await History.find(filter).sort({ time: 1 });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 추가
router.post("/", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "amount is required" });
    }

    const history = new History({ amount, time: new Date() });
    const savedHistory = await history.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await History.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
