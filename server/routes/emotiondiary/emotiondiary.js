const express = require("express");
const router = express.Router();
const { requireSignIn } = require("../middlewares/auth");
const EmotionDiary = require("../../models/emotiondiary/emotiondiary");
const { parseDateRange } = require("../../utils/date");

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

module.exports = router;
