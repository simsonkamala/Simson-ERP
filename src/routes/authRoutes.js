const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const isProduction = process.env.NODE_ENV === "production";

// === 🔐 Token Generators ===
const generateAccessToken = (id, role, username) =>
  jwt.sign({ id, role, username }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (id, username) =>
  jwt.sign({ id, username }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

// === 📝 Register ===
router.post("/register", async (req, res) => {
  const { username, name, phone, password, role } = req.body;

  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ msg: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, name, phone, password: hash, role });

  const token = generateAccessToken(user._id, user.role, user.username);
  const refresh = generateRefreshToken(user._id, user.username);

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  res.cookie("refreshToken", refresh, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/api/auth/refresh",
  });

  res.json({ user: { username: user.username, role: user.role } });
});

// === 🔐 Login ===
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

  const token = generateAccessToken(user._id, user.role, user.username);
  const refresh = generateRefreshToken(user._id, user.username);

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  res.cookie("refreshToken", refresh, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/api/auth/refresh",
  });

  res.json({ user: { username: user.username, role: user.role } });
});

// === 🚪 Logout ===
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  res.json({ msg: "Logged out" });
});

// === 🔁 Refresh Access Token ===
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.id, decoded.role, decoded.username);

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    res.send({ ok: true });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.sendStatus(403);
  }
});

// === 👤 Get Current User Info ===
router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      user: {
        username: decoded.username,
        role: decoded.role,
        id: decoded.id,
      },
    });
  } catch {
    res.sendStatus(403);
  }
});

module.exports = router;
