const cron = require("node-cron");
const axios = require("axios");

cron.schedule("0 8 * * *", async () => {
  console.log("⏳ Checking low progress students...");
  await axios.get("http://localhost:5000/check-low-progress");
});
