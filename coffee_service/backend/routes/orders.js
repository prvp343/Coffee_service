const express = require("express");
const Order = require("../models/Order");

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

module.exports = router;
