const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
require("./db");

const predictionRoutes = require("./routes/predictions");

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/predictions", predictionRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на http://localhost:${PORT}`);
});
