const { v4: uuidv4 } = require("uuid");
const redisClient = require("../config/redisClient");
const { sendMail } = require("../services/emailService");

const ttl = 180;
const ttlMinutes = Math.ceil(ttl / 60);
const resendCooldown = 60;
const verifiedTTL = 3600;

function generateVerificationCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; ++i) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

function buildHtmlBody({ target, code }) {
  return `
  <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #222; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="text-align: center; color: #0c5ef7; margin-bottom: 24px;">
      NyanSpace 인증코드 : <strong style="font-size: 1.5em;">${code}</strong>
    </h2>

    <p style="font-weight: bold; font-size: 1.1em;">${target}님, 안녕하세요.</p>

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
}

async function sendVerificationCode({ email, targetLabel = email }) {
  try {
    const cooldownKey = `verify:cooldown:${email}`;
    const onCooldown = await redisClient.get(cooldownKey);
    if (onCooldown) {
      const cooldownLeft = await redisClient.ttl(cooldownKey);
      throw {
        status: 429,
        error: `인증 요청이 너무 빠릅니다. ${cooldownLeft}초 후 다시 시도하세요.`,
        cooldownLeft,
      };
    }

    const uuid = uuidv4();
    const code = generateVerificationCode();

    await redisClient.set(cooldownKey, "1", { EX: resendCooldown });

    const codeKey = `verify:code:${uuid}`;
    await redisClient.set(codeKey, JSON.stringify({ email, code }), {
      EX: ttl,
    });

    const html = buildHtmlBody({ target: targetLabel, code });
    await sendMail(email, `NyanSpace 인증코드: ${code}`, html);

    return { uuid, ttl, resendCooldown };
  } catch (err) {
    console.error("sendVerificationCode Fail:", err);
    throw err;
  }
}

async function verifyCode(uuid, inputCode) {
  const codeKey = `verify:code:${uuid}`;
  const verifiedKey = `verify:verified:${uuid}`;

  const data = await redisClient.get(codeKey);
  if (!data) throw { status: 410, error: "인증코드가 만료되었거나 없습니다." };

  const { email, code } = JSON.parse(data);
  if (code !== inputCode)
    throw { status: 401, error: "인증코드가 올바르지 않습니다." };

  await redisClient.del(codeKey);
  await redisClient.set(verifiedKey, email, { EX: verifiedTTL });

  return email;
}

async function getVerifiedEmail(uuid) {
  const verifiedKey = `verify:verified:${uuid}`;
  return redisClient.get(verifiedKey);
}

async function clearVerified(uuid) {
  const verifiedKey = `verify:verified:${uuid}`;
  return redisClient.del(verifiedKey);
}

module.exports = {
  sendVerificationCode,
  verifyCode,
  getVerifiedEmail,
  clearVerified,
};
