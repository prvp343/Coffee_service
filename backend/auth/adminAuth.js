const { randomUUID } = require("crypto");

const sessions = new Set();

function getToken(request) {
  return request.get("Authorization")?.replace("Bearer ", "");
}

function createSession() {
  const token = randomUUID();
  sessions.add(token);
  return token;
}

function deleteSession(request) {
  sessions.delete(getToken(request));
}

function adminAuth(request, response, next) {
  if (!sessions.has(getToken(request))) {
    return response.status(401).json({ message: "Потрібна авторизація" });
  }

  next();
}

module.exports = { adminAuth, createSession, deleteSession };
