require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const drinktrackerGoalRoutes = require("./routes/drinktracker/goal");
const drinktrackerHisotoriesRoutes = require("./routes/drinktracker/histories");

const app = express();
const PORT = process.env.PORT || 5000;

// DB 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());

// API 라우터
app.use("/api/drinktracker/goal", drinktrackerGoalRoutes);
app.use("/api/drinktracker/histories", drinktrackerHisotoriesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
