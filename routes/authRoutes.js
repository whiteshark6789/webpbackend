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

// GET PROFILE
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE PROFILE
router.put("/profile/:userId", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email, phone, address },
      { new: true }
    ).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
