import React, { useState } from "react";
import { TextField, Button, Stack, Typography, Grid } from "@mui/material";
import { searchYoutube } from "../api/youtube/YoutubeApi";
import YoutubeSearchResultItem from "../components/youtube/YoutubeSearchResultItem";

export default function YoutubeSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await searchYoutube(query);
      const data = res.data;
      setResults(data.items || []);
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <Stack
      alignItems="center"
      spacing={3}
      sx={{
        width: "100%",
        mx: "auto",
        px: 2,
        boxSizing: "border-box",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ width: "100%", maxWidth: 700 }}>
        <TextField
          label="검색어"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          size="small"
          fullWidth
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          검색
        </Button>
      </Stack>

      {loading && (
        <Typography sx={{ mt: 4, color: "gray" }}>검색 중...</Typography>
      )}
      {!loading && results.length === 0 && query && (
        <Typography sx={{ mt: 4, color: "gray" }}>
          검색 결과가 없습니다.
        </Typography>
      )}

      <Grid container spacing={3} sx={{ width: "100%" }}>
        {results.map((item) => (
          <Grid
            key={item.id.videoId || item.id.channelId || item.id.playlistId}
            size={{ xs: 12 }}
          >
            <YoutubeSearchResultItem video={item} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
