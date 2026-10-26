const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const adminRouter = require("./routes/admin");

const app = express();
const port = process.env.PORT || 5000;
const frontendFolder = path.join(__dirname, "..", "frontend", "dist");

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

app.use("/api/admin", adminRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.get("/api", (request, response) => {
  response.json({ message: "API працює" });
});

app.use(express.static(frontendFolder));
app.get(/.*/, (request, response) => {
  response.sendFile(path.join(frontendFolder, "index.html"));
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
