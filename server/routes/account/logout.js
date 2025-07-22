const express = require("express");
const router = express.Router();
const Account = require("../../models/account/account");

router.post("/logout", async (req, res) => {
  const account = await Account.findOne({ email: req.session.email });
  if (!account) {
    return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
  }

  account.lastLogoutTime = new Date();
  await account.save();

  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "서버 오류" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "로그아웃 성공" });
  });
});

module.exports = router;
