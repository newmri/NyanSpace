require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const drinktrackerGoalHistoriesRoutes = require("./routes/drinktracker/histories/goal");
const drinktrackerDrinkHistoriesRoutes = require("./routes/drinktracker/histories/drink");
const signupRoutes = require("./routes/signup");

const app = express();
const PORT = process.env.PORT || 5000;

// DB 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());

// API 라우터
app.use("/api/drinktracker/histories/goal", drinktrackerGoalHistoriesRoutes);
app.use("/api/drinktracker/histories/drink", drinktrackerDrinkHistoriesRoutes);
app.use("/api/signup", signupRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
