const mongoose = require("mongoose");

const DrinkHistorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} 는 정수가 아닙니다.",
      },
    },
    time: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

DrinkHistorySchema.index({ time: 1 });

module.exports = mongoose.model("DrinkHistory", DrinkHistorySchema);
