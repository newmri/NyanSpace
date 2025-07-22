import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Link,
  Stack,
  CircularProgress,
} from "@mui/material";
import { validateEmail } from "../../utils/validate";
import { generateCode, verifyCode, signup } from "../../api/SignUpApi";

const getInitialErrors = () => ({ email: "", nickname: "", password: "" });

export default function SignUpModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState(getInitialErrors());

  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");

  const [codeExpireTime, setCodeExpireTime] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);

  // 다이얼로그 열릴 때 초기화
  useEffect(() => {
    if (open) {
      setEmail("");
      setNickname("");
      setPassword("");
      setErrors(getInitialErrors());
      setCodeSent(false);
      setEmailVerified(false);
      setUuid(null);
      setEnteredCode("");
      setCodeExpireTime(0);
      setResendCooldown(0);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!codeSent || emailVerified) return;
    if (codeExpireTime <= 0) {
      setCodeSent(false);
      setUuid(null);
      alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      return;
    }

    const interval = setInterval(() => {
      setCodeExpireTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [codeSent, codeExpireTime, emailVerified]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleGenerateCode = async () => {
    if (!nickname) {
      setErrors((prev) => ({
        ...prev,
        nickname: "닉네임을 입력해주세요.",
      }));
      return;
    }

    if (!email || !validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일을 입력해주세요.",
      }));
      return;
    }

    if (resendCooldown > 0) {
      alert(`${resendCooldown}초 뒤에 다시 시도해주세요.`);
      return;
    }

    try {
      setLoading(true);
      const res = await generateCode(nickname, email);
      const data = res.data;

      setEmailVerified(false);
      setCodeSent(true);
      setUuid(data.uuid);
      setCodeExpireTime(data.ttl);
      setResendCooldown(data.resendCooldown);
      alert("인증 코드가 전송되었습니다.");
    } catch (err) {
      if (err.response && err.response.data) {
        const { error, cooldownLeft } = err.response.data;
        if (cooldownLeft) {
          setEmailVerified(false);
          setCodeSent(true);
          setResendCooldown(cooldownLeft);
        } else {
          alert(error);
        }
      } else {
        alert("인증 코드 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyCode(uuid, enteredCode);
      setEmailVerified(true);
      setCodeSent(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("인증 실패");
      }
    }
  };

  const isValidSignUpForm = () => {
    const newErrors = getInitialErrors();

    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!nickname) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    if (false === isValidSignUpForm()) {
      return;
    }

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      await signup(uuid, nickname, email, password);
      alert(`${nickname}님 환영합니다!.`);
      handleDialogClose(null, null, true);
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  const handleDialogClose = (event, reason, isSuccess = false) => {
    onClose(isSuccess);
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        회원가입
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1}>
            <TextField
              label="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
              }}
              fullWidth
              placeholder="물마시는곰돌이"
              error={!!errors.nickname}
              helperText={errors.nickname}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <TextField
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailVerified(false);
              }}
              placeholder="youremail@naver.com"
              error={!!errors.email}
              helperText={errors.email}
              sx={{ flex: 1 }}
              disabled={loading || codeSent || emailVerified}
            />
            <Button
              variant="outlined"
              onClick={handleGenerateCode}
              disabled={loading || resendCooldown > 0}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{ whiteSpace: "nowrap", px: 2 }}
            >
              코드 전송
            </Button>
          </Stack>

          {((codeSent && !emailVerified) || resendCooldown > 0) && (
            <>
              {codeSent && !emailVerified && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="인증 코드"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    fullWidth
                  />
                  <Button variant="outlined" onClick={handleVerifyCode}>
                    확인
                  </Button>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Box sx={{ fontSize: "0.875rem", color: "gray" }}>
                  {codeExpireTime > 0 ? (
                    <>
                      남은 시간:{" "}
                      {String(Math.floor(codeExpireTime / 60)).padStart(2, "0")}
                      :{String(codeExpireTime % 60).padStart(2, "0")}
                    </>
                  ) : (
                    "인증 시간 만료"
                  )}
                </Box>
                <Button
                  size="small"
                  disabled={resendCooldown > 0}
                  onClick={handleGenerateCode}
                >
                  {resendCooldown > 0
                    ? `${resendCooldown}초 후 재전송`
                    : "재전송"}
                </Button>
              </Stack>
            </>
          )}
          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ py: 1.5, mt: 1 }}
          >
            회원가입
          </Button>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 1, fontSize: "0.875rem" }}
          >
            <Link href="#" underline="hover" variant="body2">
              비밀번호 찾기
            </Link>
            <Link
              component="button"
              type="button"
              underline="hover"
              variant="body2"
              onClick={() => {
                handleDialogClose(null, null, true);
              }}
            >
              로그인
            </Link>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
