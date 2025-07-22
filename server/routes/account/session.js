const express = require("express");
const router = express.Router();
const Account = require("../../models/account/account");

router.get("/session", async (req, res) => {
  try {
    if (!req.session.email) {
      return res.status(401).json({ error: "로그인 상태가 아닙니다." });
    }

    const account = await Account.findOne({ email: req.session.email });
    if (!account) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    return res.json({ account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
