const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const { sendMail } = require("../../services/emailService");
const redisClient = require("../../config/redisClient");
const Account = require("../../models/account/account");

function generateVerificationCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; ++i) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

const ttl = 180;
const ttlMinutes = Math.ceil(ttl / 60);
const resendCooldown = 60;
const verifiedTTL = 3600;

router.post("/generate-code", async (req, res) => {
  const { nickname, email } = req.body;

  if (!nickname) return res.status(400).json({ error: "닉네임이 필요합니다." });
  if (!email) return res.status(400).json({ error: "이메일이 필요합니다." });

  try {
    const cooldownKey = `verify:cooldown:${email}`;
    const onCooldown = await redisClient.get(cooldownKey);
    if (onCooldown) {
      const cooldownLeft = await redisClient.ttl(cooldownKey);
      return res.status(429).json({
        error: `인증 요청이 너무 빠릅니다. ${cooldownLeft}초 후 다시 시도하세요.`,
        cooldownLeft,
      });
    }

    const uuid = uuidv4();

    await redisClient.set(cooldownKey, "1", {
      EX: resendCooldown,
    });

    const codeKey = `verify:code:${uuid}`;

    const code = generateVerificationCode();
    await redisClient.set(codeKey, JSON.stringify({ email, code }), {
      EX: ttl,
    });

    const htmlBody = `
  <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #222; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="text-align: center; color: #0c5ef7; margin-bottom: 24px;">
      NyanSpace 인증코드 : <strong style="font-size: 1.5em;">${code}</strong>
    </h2>

    <p style="font-weight: bold; font-size: 1.1em;">${nickname}님, 안녕하세요.</p>

    <p style="font-size: 1em; margin-bottom: 20px;">
      현재 본인 인증 중입니다. 귀하의 인증코드는
      <a href="#" style="color: #0c5ef7; text-decoration: none; font-weight: bold;">${code}</a> 입니다.<br/>
      ${ttlMinutes}분 안에 인증을 완료해 주세요.<br/>
      <br/>
      NyanSpace
    </p>

    <p style="font-size: 0.85em; color: #888; border-top: 1px solid #eee; padding-top: 12px;">
      ※ 본 메일은 자동응답 메일이므로 본 메일에 회신하지 마시기 바랍니다.
    </p>
  </div>
`;

    await sendMail(email, `NyanSpace 인증코드: ${code}`, htmlBody);
    res.json({ uuid, ttl, resendCooldown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "이메일 전송 실패" });
  }
});

router.post("/verify-code", async (req, res) => {
  const { uuid, code } = req.body;

  if (!uuid || !code) {
    return res.status(400).json({ error: "인증코드가 올바르지 않습니다." });
  }

  const codeKey = `verify:code:${uuid}`;
  const verifiedKey = `verify:verified:${uuid}`;

  try {
    const data = await redisClient.get(codeKey);
    if (!data) {
      return res
        .status(410)
        .json({ error: "인증코드가 만료되었거나 없습니다." });
    }

    const { email: savedEmail, code: savedCode } = JSON.parse(data);
    if (savedCode !== code) {
      return res.status(401).json({ error: "인증코드가 올바르지 않습니다." });
    }

    await redisClient.del(codeKey);
    await redisClient.set(verifiedKey, savedEmail, { EX: verifiedTTL });

    return res.json({ message: "인증 성공" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "인증 확인 중 서버 오류가 발생했습니다." });
  }
});

router.post("/signup", async (req, res) => {
  const { uuid, nickname, email, password } = req.body;

  if (!uuid || !nickname || !email || !password) {
    return res.status(400).json({ error: "데이터가 올바르지 않습니다." });
  }

  const verifiedKey = `verify:verified:${uuid}`;

  try {
    const savedEmail = await redisClient.get(verifiedKey);
    if (!savedEmail) {
      return res.status(410).json({ error: "인증이 만료 되었습니다." });
    }

    if (email !== savedEmail) {
      return res
        .status(401)
        .json({ error: "이메일이 잘못 되었습니다 다시 인증 해주세요." });
    }

    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "이미 사용 중인 이메일입니다." });
    }

    const newAccount = new Account({
      nickname,
      email,
      password,
      lastLoginIP: req.ip,
    });

    await newAccount.save();
    await redisClient.del(verifiedKey);

    return res.json({ message: "회원가입 성공" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "회원가입 중 서버 오류가 발생했습니다." });
  }
});

module.exports = router;
