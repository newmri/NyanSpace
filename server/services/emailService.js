const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * 이메일 전송 함수
 * @param {string} to 수신자 이메일
 * @param {string} subject 제목
 * @param {string} text 본문 텍스트
 */
async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
