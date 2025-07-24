const express = require("express");
const router = express.Router();
const Account = require("../../models/account/account");

router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "이메일과 비밀번호가 필요합니다." });
  }

  try {
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(401).json({ error: "존재하지 않는 이메일입니다." });
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "비밀번호가 올바르지 않습니다." });
    }

    account.lastSignInTime = new Date();
    account.lastSignInIP = req.ip;
    await account.save();

    req.session.accountId = account._id;

    return res.json({ account });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "로그인 중 서버 오류가 발생했습니다." });
  }
});

module.exports = router;
