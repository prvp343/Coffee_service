const express = require("express");
const Order = require("../models/Order");
const { adminAuth } = require("../auth/adminAuth");

const router = express.Router();

router.post("/", async (request, response) => {
  try {
    const order = await Order.create(request.body);
    response.status(201).json(order);
  } catch (error) {
    response.status(400).json({
      message: "Не вдалося створити замовлення",
      error: error.message,
    });
  }
});

router.get("/", adminAuth, async (request, response) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name")
      .sort({ createdAt: -1 });
    response.json(orders);
  } catch (error) {
    response.status(500).json({ message: "Не вдалося отримати замовлення" });
  }
});

module.exports = router;
