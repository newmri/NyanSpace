const mongoose = require("mongoose");

const GoalHistorySchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} 는 정수가 아닙니다.",
      },
    },
    goal: {
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

GoalHistorySchema.index({ account: 1, time: 1 });

module.exports = mongoose.model("GoalHistory", GoalHistorySchema);
