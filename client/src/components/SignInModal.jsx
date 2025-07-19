import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Stack,
} from "@mui/material";
import { validateEmail } from "../utils/validate";

export default function SignInModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setError("");
    // 로그인 API 호출 등 처리
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
            error={!!error && error.includes("이메일")}
            helperText={error && error.includes("이메일") ? error : ""}
          />
          <TextField
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            error={!!error && error.includes("비밀번호")}
            helperText={error && error.includes("비밀번호") ? error : ""}
          />
          {!error && (
            <Typography
              variant="body2"
              color="error"
              textAlign="center"
              sx={{ visibility: "hidden" }}
            >
              {/* 공간 확보용 투명 텍스트 */}
              &nbsp;
            </Typography>
          )}

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
            <Link href="#" underline="hover" variant="body2">
              회원가입
            </Link>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
