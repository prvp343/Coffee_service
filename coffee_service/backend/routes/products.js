const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    response.json(products);
  } catch (error) {
    response.status(500).json({ message: "Не вдалося отримати товари" });
  }
});

router.post("/", async (request, response) => {
  try {
    const product = await Product.create(request.body);
    response.status(201).json(product);
  } catch (error) {
    response.status(400).json({
      message: "Не вдалося додати товар",
      error: error.message,
    });
  }
});

module.exports = router;
