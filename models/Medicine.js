const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  category: {
    type: String
  },
  stock: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Medicine", medicineSchema);
