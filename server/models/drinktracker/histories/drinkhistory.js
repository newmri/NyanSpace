const mongoose = require("mongoose");

const DrinkHistorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("DrinkHistory", DrinkHistorySchema);
