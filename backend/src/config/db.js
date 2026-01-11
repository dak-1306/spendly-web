const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  try {
    // remove deprecated options (Mongoose v7+)
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
