import React, { useState } from "react";
import { Typography, Grid, Box, IconButton } from "@mui/material";
import { decodeHtml } from "../../utils/decode";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

export default function YoutubeSearchResultItem({ video }) {
  const videoId = video.id?.videoId;
  const snippet = video.snippet;

  const [hover, setHover] = useState(false);
  const [unmuted, setUnmuted] = useState(false);

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => {
    setHover(false);
    setUnmuted(false);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setUnmuted((prev) => !prev);
  };

  // 새창 열기 함수
  const openYoutubeVideo = (e) => {
    e.stopPropagation(); // 이벤트 전파 막아서 부모 이벤트 중복 방지
    if (videoId) {
      window.open(
        `https://www.youtube.com/watch?v=${videoId}`,
        "_blank",
        "noopener"
      );
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mb: 3,
        cursor: "pointer",
        "&:hover": { backgroundColor: "#f9f9f9" },
      }}
      // onClick은 제거해서 부모 클릭 이벤트로 인한 hover 상태 초기화를 방지
    >
      {/* 썸네일 + 미리보기 영역 */}
      <Grid
        size={{ xs: 12, sm: 5, md: 4, lg: 3 }}
        sx={{
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openYoutubeVideo} // 썸네일 클릭 시 새창 열기
      >
        {!hover && (
          <Box
            component="img"
            src={snippet.thumbnails.medium.url}
            alt={decodeHtml(snippet.title)}
            sx={{
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        )}

        {hover && videoId && (
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${
              unmuted ? "0" : "1"
            }&controls=0&modestbranding=1&rel=0&showinfo=0`}
            title={decodeHtml(snippet.title)}
            allow="autoplay"
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              border: 0,
              borderRadius: 1,
              pointerEvents: "none", // iframe 내 클릭 막아서 iframe 클릭 시 새창 안열리게, 부모 클릭만 가능
            }}
          />
        )}

        {hover && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleMute(e);
            }}
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              zIndex: 10,
              padding: "6px",
            }}
            aria-label={unmuted ? "Mute" : "Unmute"}
          >
            {unmuted ? (
              <VolumeUpIcon fontSize="small" />
            ) : (
              <VolumeOffIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Grid>

      {/* 텍스트 영역 */}
      <Grid
        size={{ xs: 12, sm: 7, md: 8, lg: 9 }}
        sx={{ position: "relative", display: "flex", flexDirection: "column" }}
        onClick={openYoutubeVideo} // 텍스트 영역 클릭 시 새창 열기
      >
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 0.7,
            pr: 4,
          }}
          title={decodeHtml(snippet.title)}
        >
          {decodeHtml(snippet.title)}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          title={decodeHtml(snippet.channelTitle)}
          sx={{ mb: 0.7 }}
        >
          {decodeHtml(snippet.channelTitle)}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.7 }}>
          {new Date(snippet.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Typography>

        {snippet.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.875rem",
              opacity: 0.7,
            }}
            title={decodeHtml(snippet.description)}
          >
            {decodeHtml(snippet.description)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
