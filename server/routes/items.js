const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// 전체 아이템 조회
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 아이템 추가
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const newItem = new Item({ name });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
