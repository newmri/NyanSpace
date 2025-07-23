const express = require("express");
const router = express.Router();
const {
  sendVerificationCode,
  verifyCode,
  getVerifiedEmail,
  clearVerified,
} = require("../../utils/verification");

router.post("/generate-code", async (req, res) => {
  const { nickname, email } = req.body;
  if (!nickname || !email)
    return res.status(400).json({ error: "닉네임과 이메일이 필요합니다." });

  try {
    const result = await sendVerificationCode({ email, targetLabel: nickname });
    res.json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      error: err.error || "서버 오류",
      cooldownLeft: err.cooldownLeft,
    });
  }
});

router.post("/verify-code", async (req, res) => {
  const { uuid, code } = req.body;
  if (!uuid || !code)
    return res.status(400).json({ error: "인증코드가 필요합니다." });

  try {
    await verifyCode(uuid, code);
    res.json({ message: "인증 성공" });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.error || "서버 오류" });
  }
});

router.post("/", async (req, res) => {
  const { uuid, nickname, email, password } = req.body;
  if (!uuid || !nickname || !email || !password) {
    return res.status(400).json({ error: "데이터가 올바르지 않습니다." });
  }

  try {
    const savedEmail = await getVerifiedEmail(uuid);
    if (!savedEmail)
      return res.status(410).json({ error: "인증이 만료 되었습니다." });
    if (email !== savedEmail)
      return res.status(401).json({ error: "이메일 불일치" });

    const existing = await Account.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "이미 사용 중인 이메일입니다." });

    const newAccount = new Account({
      nickname,
      email,
      password,
      lastLoginIP: req.ip,
    });
    await newAccount.save();
    await clearVerified(uuid);

    res.json({ message: "회원가입 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "회원가입 중 오류 발생" });
  }
});

module.exports = router;
