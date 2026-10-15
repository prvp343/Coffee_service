const express = require("express");
const Product = require("../models/Product");
const { adminAuth } = require("../auth/adminAuth");

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const products = await Product.find().sort({ category: 1, name: 1 });
    response.json(products);
  } catch (error) {
    response.status(500).json({ message: "Не вдалося отримати товари" });
  }
});

router.post("/", adminAuth, async (request, response) => {
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

router.put("/:id", adminAuth, async (request, response) => {
  try {
    const product = await Product.findByIdAndUpdate(request.params.id, request.body, {
      returnDocument: "after",
      runValidators: true,
    });

    return product
      ? response.json(product)
      : response.status(404).json({ message: "Товар не знайдено" });
  } catch (error) {
    return response.status(400).json({ message: "Не вдалося змінити товар" });
  }
});

router.delete("/:id", adminAuth, async (request, response) => {
  try {
    const product = await Product.findByIdAndDelete(request.params.id);
    return product
      ? response.json({ message: "Товар видалено" })
      : response.status(404).json({ message: "Товар не знайдено" });
  } catch (error) {
    return response.status(400).json({ message: "Не вдалося видалити товар" });
  }
});

module.exports = router;
