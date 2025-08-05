const express = require("express");
const router = express.Router();
const { requireSignIn } = require("../middlewares/auth");
const EmotionDiary = require("../../models/emotiondiary/emotiondiary");
const { parseDateRange, getTodayDate } = require("../../utils/date");

router.get("/", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;
    const { start, end } = req.query;

    const range = parseDateRange(start, end);

    const diariesInRange = await EmotionDiary.find({
      account,
      time: { $gte: range.startDate, $lte: range.endDate },
    }).sort({ time: 1 });

    res.json(diariesInRange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;
    const { emotion, text } = req.body;

    const todayDate = getTodayDate();
    const range = parseDateRange(todayDate, todayDate);

    const existingDiary = await EmotionDiary.findOne({
      account,
      time: { $gte: range.startDate, $lte: range.endDate },
    });

    if (existingDiary) {
      return res
        .status(400)
        .json({ message: "오늘 일기를 이미 작성했습니다." });
    }

    const newDiary = new EmotionDiary({
      account,
      emotion,
      text,
      time: new Date(),
    });

    await newDiary.save();
    res.status(201).json(newDiary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;
    const { id } = req.params;
    const { emotion, text } = req.body;

    const diary = await EmotionDiary.findOne({
      _id: id,
      account,
    });

    if (!diary) {
      return res.status(404).json({ message: "해당 일기를 찾을 수 없습니다." });
    }

    diary.emotion = emotion;
    diary.text = text;

    await diary.save();

    res.json(diary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", requireSignIn, async (req, res) => {
  try {
    const account = req.session.accountId;
    const { id } = req.params;

    const diary = await EmotionDiary.findOneAndDelete({
      _id: id,
      account,
    });

    if (!diary) {
      return res
        .status(404)
        .json({ message: "Diary not found or not authorized" });
    }

    res.json({ message: "Diary deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
