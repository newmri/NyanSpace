const mongoose = require("mongoose");

const DrinkHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("DrinkHistory", DrinkHistorySchema);
