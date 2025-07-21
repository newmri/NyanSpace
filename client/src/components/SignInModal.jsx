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
} from "@mui/material";
import { validateEmail } from "../utils/validate";

const getInitialErrors = () => ({ email: "", password: "" });

export default function SignInModal({ open, onClose, onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(getInitialErrors());

  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setErrors(getInitialErrors());
    }
  }, [open]);

  const handleSubmit = () => {
    const newErrors = getInitialErrors();

    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ email: "", password: "" });
    alert(`로그인 시도: ${email} / ${password}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        로그인
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
          <TextField
            label="이메일"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            autoFocus
            placeholder="youremail@naver.com"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="비밀번호"
            type="password"
            autoComplete="current-password"
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
            로그인
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
                onClose();
                onSignUp();
              }}
            >
              회원가입
            </Link>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
