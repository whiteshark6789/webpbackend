const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

router.get("/", async (req, res) => {
  const medicines = await Medicine.find();
  res.json(medicines);
});

module.exports = router;
