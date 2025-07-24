const express = require("express");
const router = express.Router();
const DrinkHistory = require("../../../models/drinktracker/histories/drinkhistory");
const { requireSignIn } = require("../../middlewares/auth");

// 기록 조회
router.get("/", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    let filter = { account };
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

// 기록 범위 조회
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

    const histories = await DrinkHistory.find({
      account,
      time: { $gte: startDate, $lte: endDate },
    }).sort({ time: 1 });

    res.json(histories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 추가
router.post("/", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    const { type, amount } = req.body;
    if (!type || !amount) {
      return res.status(400).json({ message: "type, amount 필수" });
    }

    const history = new DrinkHistory({ account, type, amount });
    const savedHistory = await history.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 기록 수정
router.put("/:id", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    const { type, amount } = req.body;
    if (!type || typeof amount !== "number") {
      return res.status(400).json({ message: "type과 amount는 필수입니다." });
    }

    const updated = await DrinkHistory.findOneAndUpdate(
      { _id: req.params.id, account },
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
router.delete("/:id", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;

    const deleted = await DrinkHistory.findOneAndDelete({
      _id: req.params.id,
      account,
    });

    if (!deleted) {
      return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
