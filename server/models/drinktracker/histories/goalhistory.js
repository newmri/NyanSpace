const mongoose = require("mongoose");

const GoalHistorySchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("GoalHistory", GoalHistorySchema);
