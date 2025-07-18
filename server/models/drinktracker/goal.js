const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Goal", GoalSchema);
