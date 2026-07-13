const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const controller = require("../controllers/predictionController");

// Використовуємо memory storage, потім завантажуємо у Cloudinary
const storage = multer.memoryStorage();

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

// Middleware для завантаження на Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "predictions", resource_type: "auto" },
    (error, result) => {
      if (error) {
        return res
          .status(400)
          .json({ message: "Помилка завантаження", error: error.message });
      }
      req.cloudinaryUrl = result.secure_url;
      next();
    },
  );

  uploadStream.end(req.file.buffer);
};

router.get("/", controller.getAll);
router.get("/random", controller.getRandom);
router.get("/:id", controller.getById);
router.post(
  "/",
  upload.single("imageFile"),
  uploadToCloudinary,
  controller.create,
);
router.put(
  "/:id",
  upload.single("imageFile"),
  uploadToCloudinary,
  controller.update,
);
router.delete("/:id", controller.remove);

module.exports = router;
