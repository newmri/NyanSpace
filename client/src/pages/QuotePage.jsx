import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { getQuote } from "../api/quote/QuoteApi.js";

export default function QuotePage() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await getQuote();
      const data = res.data;
      setQuote(data);
    } catch (err) {
      console.error("명언을 가져오지 못했습니다:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Stack alignItems="center" spacing={4}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card
          sx={{
            p: 4,
            mx: "auto",
            backgroundColor: "#f9f9f9",
            borderRadius: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <CardContent>
            {loading ? (
              <Typography align="center">로딩 중...</Typography>
            ) : quote ? (
              <>
                <Typography
                  component="blockquote"
                  align="center"
                  sx={{
                    fontStyle: "italic",
                    color: "text.primary",
                    lineHeight: 1.8,
                    px: 6,
                    fontSize: "1.25rem",
                    userSelect: "none",
                    position: "relative",
                  }}
                >
                  {/* 좌측 상단 큰 따옴표 */}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "3rem",
                      color: "grey.400",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      userSelect: "none",
                      lineHeight: 1,
                      pointerEvents: "none",
                      transform: "translate(0%, -60%)",
                    }}
                  >
                    “
                  </Typography>

                  {/* 실제 인용문 텍스트 */}
                  {quote.quote.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}

                  {/* 우측 하단 큰 따옴표 */}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "3rem",
                      color: "grey.400",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      userSelect: "none",
                      lineHeight: 1,
                      pointerEvents: "none",
                      transform: "translate(0%, 60%)",
                    }}
                  >
                    ”
                  </Typography>
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    position: "absolute",
                    bottom: 15,
                    right: 30,
                    userSelect: "none",
                  }}
                >
                  — {quote.author}
                </Typography>
              </>
            ) : (
              <Typography align="center">명언이 없습니다.</Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Button variant="outlined" onClick={fetchQuote}>
        다른 명언 보기
      </Button>
    </Stack>
  );
}
