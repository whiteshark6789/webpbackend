const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET cart (create if not exists)
router.get("/:userId", async (req, res) => {
  let cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) cart = await Cart.create({ userId: req.params.userId, items: [] });

  const syncedItems = [];
  let subtotal = 0;

  for (let item of cart.items) {
    const liveProduct = await Product.findById(item.productId);

    if (liveProduct && liveProduct.stock > 0) {
      item.name = liveProduct.name;
      item.price = liveProduct.price;

      if (item.qty > liveProduct.stock) {
        item.qty = liveProduct.stock;
      }

      syncedItems.push({
        ...item.toObject(),
        stock: liveProduct.stock,
        image: liveProduct.image
      });
      subtotal += item.price * item.qty;
    }
  }

  cart.items = syncedItems.map(si => ({
    productId: si.productId,
    name: si.name,
    price: si.price,
    qty: si.qty
  }));
  await cart.save();

  res.json({
    items: syncedItems,
    subtotal,
    shipping: 0,
    total: subtotal
  });
});

// ADD item
router.post("/add", async (req, res) => {
  const { userId, product } = req.body;
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  const item = cart.items.find(
    i => i.productId.toString() === product.productId
  );

  if (item) item.qty += 1;
  else cart.items.push({ ...product, qty: 1 });

  await cart.save();
  res.json({ message: "Added to cart" });
});

// UPDATE cart item quantity
router.put("/update/:userId", async (req, res) => {
  const { productId, qty } = req.body;
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (cart) {
    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) {
      item.qty = Number(qty);
      await cart.save();
    }
  }
  res.json({ message: "Quantity updated" });
});

// CLEAR cart
router.delete("/clear/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: "Cart cleared" });
});

module.exports = router;
