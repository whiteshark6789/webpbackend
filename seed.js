require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Paracetamol 500mg",
    price: 45,
    stock: 120,
    category: "Pain Relief",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
  },
  {
    name: "Amoxicillin 250mg",
    price: 180,
    stock: 85,
    category: "Antibiotics",
    image: "https://images.unsplash.com/photo-1576073719710-aa6935272a29?w=400"
  },
  {
    name: "Vitamin C Tablets",
    price: 120,
    stock: 200,
    category: "Supplements",
    image: "https://images.unsplash.com/photo-1616671285410-095598686e03?w=400"
  },
  {
    name: "Cough Syrup",
    price: 95,
    stock: 50,
    category: "Cough & Cold",
    image: "https://images.unsplash.com/photo-1550573104-d573ebba004c?w=400"
  },
  {
    name: "Hand Sanitizer",
    price: 60,
    stock: 150,
    category: "Hygiene",
    image: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=400"
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas for seeding...");

    // Clear existing products (optional, but good for a clean start)
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    // Insert new products
    await Product.insertMany(products);
    console.log("Successfully seeded database with sample products!");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
}

seedDB();
