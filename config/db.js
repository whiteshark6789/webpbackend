const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/asa_pharma";
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
