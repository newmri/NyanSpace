const mongoose = require("mongoose");

const EmotionDiarySchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    emotion: {
      type: String,
      required: true,
      enum: ["EXCITED", "HAPPY", "BORED", "TIRED", "SURPRISED", "SAD", "ANGRY"],
    },
    text: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

EmotionDiarySchema.index({ account: 1, time: 1 });

module.exports = mongoose.model("EmotionDiary", EmotionDiarySchema);
