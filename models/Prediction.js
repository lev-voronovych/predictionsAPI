const mongoose = require("../db");

const predictionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ["Колячний", "маніглайний", "від себе"],
    required: true,
  },
});

module.exports = mongoose.model("Prediction", predictionSchema);
