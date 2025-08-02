require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
const quoteRoutes = require("./routes/quote/quote");
const youtubeRoutes = require("./routes/youtube/youtube");
const drinktrackerGoalHistoriesRoutes = require("./routes/drinktracker/histories/goal");
const drinktrackerDrinkHistoriesRoutes = require("./routes/drinktracker/histories/drink");
const EmotionDiaryRoutes = require("./routes/emotiondiary/emotiondiary");
const signupRoutes = require("./routes/account/signup");
const signinRoutes = require("./routes/account/signin");
const signoutRoutes = require("./routes/account/signout");
const sessionRoutes = require("./routes/account/session");
const resetPasswordRoutes = require("./routes/account/resetpassword");

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30일
    },
  })
);

app.use("/api/quote", quoteRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/drinktracker/histories/goal", drinktrackerGoalHistoriesRoutes);
app.use("/api/drinktracker/histories/drink", drinktrackerDrinkHistoriesRoutes);
app.use("/api/emotiondiary", EmotionDiaryRoutes);
app.use("/api/account/signup", signupRoutes);
app.use("/api/account", signinRoutes);
app.use("/api/account", signoutRoutes);
app.use("/api/account", sessionRoutes);
app.use("/api/account/reset-password", resetPasswordRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
