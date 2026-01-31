const express = require("express");
const router = express.Router();
const Account = require("../../models/account/account");

router.get("/session", async (req, res) => {
  try {
    const accountId = req.session.accountId;

    if (!accountId) {
      return res.json({ account: null });
    }

    const account = await Account.findById(accountId);
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
