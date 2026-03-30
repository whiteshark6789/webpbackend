const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// PLACE ORDER (Unified Transaction)
router.post("/", async (req, res) => {
  const { userId, items, totalAmount } = req.body;

  try {
    // 1. Verify stock for ALL items before making any changes
    for (let item of items) {
      const liveProduct = await Product.findById(item.productId);
      if (!liveProduct || liveProduct.stock < item.qty) {
        return res.status(400).json({ error: `Not enough stock for ${item.name}` });
      }
    }

    // 2. Decrement stock for each product
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty }
      });
    }

    // 3. Create the Order document
    const order = new Order({
      userId,
      items: items.map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.qty
      })),
      totalAmount
    });
    await order.save();

    // 4. Clear the User's Cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.json({ message: "Order placed successfully!", orderId: order._id });
  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// GET ORDERS FOR USER
router.get("/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

module.exports = router;
