const express = require("express");
const router = express.Router();
const quotes = require("../../utils/quotes.json");

router.get("/", async (req, res) => {
  res.json(quotes[Math.floor(Math.random() * quotes.length)]);
});

module.exports = router;
