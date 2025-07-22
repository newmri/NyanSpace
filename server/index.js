require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
const drinktrackerGoalHistoriesRoutes = require("./routes/drinktracker/histories/goal");
const drinktrackerDrinkHistoriesRoutes = require("./routes/drinktracker/histories/drink");
const signupRoutes = require("./routes/account/signup");
const loginRoutes = require("./routes/account/login");
const logoutRoutes = require("./routes/account/logout");
const sessionRoutes = require("./routes/account/session");

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
      maxAge: 1000 * 60 * 60 * 24, // 1일
    },
  })
);

app.use("/api/drinktracker/histories/goal", drinktrackerGoalHistoriesRoutes);
app.use("/api/drinktracker/histories/drink", drinktrackerDrinkHistoriesRoutes);
app.use("/api/account", signupRoutes);
app.use("/api/account", loginRoutes);
app.use("/api/account", logoutRoutes);
app.use("/api/account", sessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
