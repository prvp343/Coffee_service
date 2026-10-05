require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

const app = express();
const port = process.env.PORT || 5000;
const frontendFolder = path.join(__dirname, "..", "frontend");

app.use(cors());
app.use(express.json());

app.use((request, response, next) => {
  const startTime = Date.now();

  response.on("finish", () => {
    if (request.originalUrl.startsWith("/api")) {
      const duration = Date.now() - startTime;
      console.log(`${request.method} ${request.originalUrl} -> ${response.statusCode} (${duration} мс)`);
    }
  });

  next();
});

app.use(express.static(frontendFolder));

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.get("/api", (request, response) => {
  response.json({ message: "API працює" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB підключено");

    app.listen(port, () => {
      console.log(`Сервер працює: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Помилка підключення до MongoDB:", error.message);
  }
}

startServer();
