const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("History", HistorySchema);
