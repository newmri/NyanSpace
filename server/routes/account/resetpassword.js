const express = require("express");
const router = express.Router();
const Account = require("../../models/account/account");

const {
  sendVerificationCode,
  verifyCode,
  getVerifiedEmail,
  clearVerified,
} = require("../../utils/verification");

// 인증 코드 요청
router.post("/generate-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "이메일이 필요합니다." });

  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ error: "존재하지 않는 이메일입니다." });
    }

    const result = await sendVerificationCode({ email, targetLabel: email });
    res.json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      error: err.error || "서버 오류",
      cooldownLeft: err.cooldownLeft,
    });
  }
});

// 인증 코드 확인
router.post("/verify-code", async (req, res) => {
  const { uuid, code } = req.body;
  if (!uuid || !code) {
    return res.status(400).json({ error: "인증코드가 필요합니다." });
  }

  try {
    await verifyCode(uuid, code);
    res.json({ message: "인증 성공" });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.error || "서버 오류" });
  }
});

// 비밀번호 재설정
router.post("/", async (req, res) => {
  const { uuid, email, password } = req.body;
  if (!uuid || !email || !password) {
    return res.status(400).json({ error: "데이터가 올바르지 않습니다." });
  }

  try {
    const savedEmail = await getVerifiedEmail(uuid);
    if (!savedEmail) {
      return res.status(410).json({ error: "인증이 만료되었습니다." });
    }

    if (email !== savedEmail) {
      return res
        .status(401)
        .json({ error: "이메일이 일치하지 않습니다. 다시 인증해주세요." });
    }

    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(404).json({ error: "존재하지 않는 이메일입니다." });
    }

    account.password = password;
    await account.save();
    await clearVerified(uuid);

    return res.json({ message: "비밀번호 변경 성공" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "비밀번호 변경 중 서버 오류가 발생했습니다." });
  }
});

module.exports = router;
