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

    let existingDiary = await EmotionDiary.findOne({
      account,
      time: { $gte: range.startDate, $lte: range.endDate },
    });

    if (existingDiary) {
      existingDiary.emotion = emotion;
      existingDiary.text = text;
      existingDiary.time = new Date();
      await existingDiary.save();
      return res.json(existingDiary);
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
