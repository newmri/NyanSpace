const express = require("express");
const router = express.Router();
const Account = require("../../models/account/account");

router.post("/sign-out", async (req, res) => {
  const accountId = req.session.accountId;
  if (!accountId) {
    return res.status(401).json({ error: "로그인 상태가 아닙니다." });
  }

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    account.lastSignOutTime = new Date();
    await account.save();

    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "서버 오류" });
      }
      res.clearCookie(process.env.SESSION_NAME);
      return res.json({ message: "로그아웃 성공" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
