require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const itemRoutes = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 5000;

// DB 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());

// API 라우터
app.use("/api/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
