const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AccountSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "유효한 이메일 형식이 아닙니다."],
    },
    password: {
      type: String,
      required: true,
    },
    lastLoginTime: {
      type: Date,
    },
    lastLogoutTime: {
      type: Date,
    },
    lastLoginIP: {
      type: String,
    },
  },
  { timestamps: true }
);

AccountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AccountSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

AccountSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Account", AccountSchema);
