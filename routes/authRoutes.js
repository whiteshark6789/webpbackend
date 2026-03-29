const express = require("express");
const router = express.Router();
const User = require("../models/User");


// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = new User({ name, email, password, role });
  await user.save();

  res.json({ message: "User created", userId: user._id });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email, password, role });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    userId: user._id,
    role: user.role
  });
});

module.exports = router;
