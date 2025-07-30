require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const redisClient = require("../../config/redisClient");

const ttl = 600;

router.get("/", async (req, res) => {
  const { query } = req.query;
  const cacheKey = `yt:${query}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
      query
    )}&maxResults=10&key=${process.env.YOUTUBE_API_KEY}`;
    const response = await axios.get(url);

    await redisClient.set(cacheKey, JSON.stringify(response.data), {
      EX: ttl,
    });

    return res.json(response.data);
  } catch (error) {
    console.error("YouTube API error:", error.message);
    return res.status(500).json({ error: "API error" });
  }
});

module.exports = router;
