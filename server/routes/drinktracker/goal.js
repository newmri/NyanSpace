const express = require("express");
const router = express.Router();
const Goal = require("../../models/drinktracker/goal");

// Get Goal
router.get("/", async (req, res) => {
  try {
    const goal = await Goal.findOne();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Goal
router.post("/", async (req, res) => {
  const { weight, goal } = req.body;
  try {
    const saved = await Goal.findOneAndUpdate(
      {},
      { weight, goal },
      { upsert: true, new: true }
    );
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
