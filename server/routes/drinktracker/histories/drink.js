const express = require("express");
const router = express.Router();
const DrinkHistory = require("../../../models/drinktracker/histories/drinkhistory");

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

    const histories = await DrinkHistory.find(filter).sort({ time: 1 });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 추가
router.post("/", async (req, res) => {
  try {
    const { type, amount } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ message: "amount is required" });
    }

    const history = new DrinkHistory({ type, amount });
    const savedHistory = await history.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 수정
router.put("/:id", async (req, res) => {
  try {
    const { type, amount } = req.body;
    if (!type || typeof amount !== "number") {
      return res.status(400).json({ message: "type과 amount는 필수입니다." });
    }

    const updated = await DrinkHistory.findByIdAndUpdate(
      req.params.id,
      { type, amount },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await DrinkHistory.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
