const express = require("express");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/predictionController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Тільки зображення"));
    }
  },
});

router.get("/", controller.getAll);
router.get("/random", controller.getRandom);
router.get("/:id", controller.getById);
router.post("/", upload.single("imageFile"), controller.create);
router.put("/:id", upload.single("imageFile"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
