const Prediction = require("../models/Prediction");

const getPredictionData = (req) => ({
  title: req.body.title,
  text: req.body.text,
  type: req.body.type,
  image: req.cloudinaryUrl || req.body.image || req.body.existingImage || "",
});

exports.getAll = async (req, res) => {
  try {
    const predictions = await Prediction.find();
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const predictions = await Prediction.find();

    if (!predictions.length) {
      return res.status(404).json({ message: "Передбачення не знайдено" });
    }

    let lastIds = [];
    if (req.query.lastIds) {
      if (Array.isArray(req.query.lastIds)) {
        lastIds = req.query.lastIds;
      } else {
        lastIds = req.query.lastIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
      }
    } else if (req.query.lastId) {
      lastIds = [req.query.lastId];
    }

    let pool = predictions;
    const recent = lastIds.slice(-2);

    if (recent.length === 2 && recent[0] === recent[1]) {
      const excludedId = recent[1];
      const available = predictions.filter(
        (item) => item._id.toString() !== excludedId,
      );
      pool = available.length ? available : predictions;
    }

    const random = pool[Math.floor(Math.random() * pool.length)];
    res.json(random);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: "Не знайдено" });
    }

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = getPredictionData(req);
    const existing = await Prediction.findOne({
      title: data.title,
      text: data.text,
    });

    if (existing) {
      return res.status(409).json({
        message: "Таке передбачення вже існує",
      });
    }

    const prediction = await Prediction.create(data);
    res.status(201).json(prediction);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Помилка створення", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndUpdate(
      req.params.id,
      getPredictionData(req),
      { new: true },
    );

    if (!prediction) {
      return res.status(404).json({ message: "Не знайдено" });
    }

    res.json(prediction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка оновлення", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndDelete(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: "Не знайдено" });
    }

    res.json({ message: "Видалено" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка видалення", error: error.message });
  }
};
