// app.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// --- In-memory stores (replace with DB in production) ---
const users = []; // { id, email, passwordHash, balance }
let refreshTokens = []; // list of valid refresh tokens (for revocation)

// --- Config from env ---
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
const PORT = process.env.PORT || 3000;

// --- Utility: Generate Tokens ---
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

// --- Middleware: Authenticate access token ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    // Attach user info to request for handlers
    req.user = user;
    next();
  });
}

// --- Routes ---

// Register
app.post('/register', async (req, res) => {
  const { email, password, initialBalance } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ message: 'User already exists' });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = {
    id: users.length + 1,
    email,
    passwordHash,
    balance: typeof initialBalance === 'number' ? initialBalance : 0
  };
  users.push(newUser);

  res.status(201).json({ message: 'User registered', userId: newUser.id });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = { id: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Persist refresh token (in-memory here)
  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken, tokenType: 'Bearer' });
});

// Token refresh
app.post('/token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
  if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Refresh token revoked or not found' });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const payload = { id: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    res.json({ accessToken });
  });
});

// Logout (revoke refresh token)
app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
  refreshTokens = refreshTokens.filter(t => t !== refreshToken);
  res.json({ message: 'Logged out (refresh token revoked)' });
});

// Protected: get balance
app.get('/balance', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ userId: user.id, email: user.email, balance: user.balance });
});

// Protected: transfer funds (very simple)
app.post('/transfer', authenticateToken, (req, res) => {
  const { toEmail, amount } = req.body;
  if (!toEmail || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'toEmail and positive numeric amount required' });
  }

  const from = users.find(u => u.id === req.user.id);
  const to = users.find(u => u.email === toEmail);

  if (!from) return res.status(404).json({ message: 'Sender not found' });
  if (!to) return res.status(404).json({ message: 'Recipient not found' });

  if (from.balance < amount) return res.status(400).json({ message: 'Insufficient funds' });

  from.balance -= amount;
  to.balance += amount;

  res.json({ message: 'Transfer successful', fromId: from.id, toId: to.id, amount });
});

// Root
app.get('/', (req, res) => {
  res.send('Banking API with JWT authentication. See documentation for endpoints.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
