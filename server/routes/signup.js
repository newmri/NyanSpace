const express = require("express");
const router = express.Router();
const { sendMail } = require("../services/emailService");

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

router.post("/verification-code", async (req, res) => {
  const { nickname, email } = req.body;

  if (!nickname) return res.status(400).json({ error: "닉네임이 필요합니다." });
  if (!email) return res.status(400).json({ error: "이메일이 필요합니다." });

  const code = generateVerificationCode();
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
  try {
    await sendMail(email, `NyanSpace 인증코드: ${code}`, htmlBody);
    res.json({ ttl, resendCooldown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "이메일 전송 실패" });
  }
});

module.exports = router;
