const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URI,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
})();

module.exports = redisClient;
