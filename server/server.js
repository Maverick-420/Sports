const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/api/matches", async (req, res) => {
  try {
    const today = new Date();
    const dateFrom = today.toISOString().split("T")[0];
    const dateTo = new Date(today.setDate(today.getDate() + 7))
      .toISOString()
      .split("T")[0];

    const response = await axios.get(
      "https://api.football-data.org/v4/matches",
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_API_KEY,
        },
        params: {
          dateFrom,
          dateTo,
        },
      }
    );
    res.json(response.data);
    console.log("Football API Response:", response.data); // 🔍 Add this
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

app.listen(3000, () => {
  console.log("Running on Port 3000");
});
