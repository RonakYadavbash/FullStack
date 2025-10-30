const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Dummy users with roles
const USERS = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "mod", password: "mod123", role: "Moderator" },
  { username: "user", password: "user123", role: "User" }
];

const SECRET_KEY = "mysecretkey";

// ----------------- LOGIN -----------------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user)
    return res.status(401).json({ message: "Invalid username or password" });

  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

// ----------------- MIDDLEWARES -----------------
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

// ----------------- PROTECTED ROUTES -----------------
app.get("/api/admin", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, you are an Admin.` });
});

app.get(
  "/api/moderator",
  verifyToken,
  authorizeRoles("Admin", "Moderator"),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.username}, you are a Moderator or Admin.` });
  }
);

app.get(
  "/api/user",
  verifyToken,
  authorizeRoles("Admin", "Moderator", "User"),
  (req, res) => {
    res.json({ message: `Welcome ${req.user.username}, this is a user route.` });
  }
);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
