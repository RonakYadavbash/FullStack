// app.js
const express = require("express");
const app = express();
const PORT = 3000;

// ===== Middleware 1: Logging =====
const logger = (req, res, next) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
};

// ===== Middleware 2: Authentication =====
const auth = (req, res, next) => {
  const token = req.headers["authorization"]; // Example: "Bearer mysecrettoken"
  if (token === "Bearer mysecrettoken") {
    next(); // Authorized
  } else {
    res.status(401).json({ message: "Unauthorized! Invalid or missing token." });
  }
};

// Use the logger middleware globally (for all routes)
app.use(logger);

// Public route (no authentication)
app.get("/", (req, res) => {
  res.send("Welcome to the Middleware Demonstration!");
});

// Protected route (requires authentication)
app.get("/dashboard", auth, (req, res) => {
  res.send("Access granted! You are viewing the protected dashboard.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
