const express = require("express");
const { adminAuth, createSession, deleteSession } = require("../auth/adminAuth");

const router = express.Router();

router.post("/login", (request, response) => {
  if (request.body.password !== process.env.ADMIN_PASSWORD) {
    return response.status(401).json({ message: "Невірний пароль" });
  }

  response.json({ token: createSession() });
});

router.get("/session", adminAuth, (request, response) => {
  response.json({ authorized: true });
});

router.post("/logout", adminAuth, (request, response) => {
  deleteSession(request);
  response.json({ message: "Вихід виконано" });
});

module.exports = router;
