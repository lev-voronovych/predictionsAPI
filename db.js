const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB підключена");
  } catch (error) {
    console.error("❌ Помилка підключення до MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

module.exports = mongoose;
