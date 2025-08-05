const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateAccessToken = (id, role, username) => jwt.sign({ id, role, username }, process.env.JWT_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (id, username) => jwt.sign({ id, username }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  const { username, name, phone, password, role } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ msg: "User exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, name, phone, password: hash, role });
  const token = generateAccessToken(user._id, user.role, user.username);
  const refresh = generateRefreshToken(user._id, user.username);
  res.cookie("token", token, { httpOnly: true });
  res.cookie("refreshToken", refresh, { httpOnly: true, path: "/api/auth/refresh" });
  res.json({ user: { username: user.username, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request:", { username, password }); // 👈 debug

  const user = await User.findOne({ username });
  if (!user) {
    console.log("User not found");
    return res.status(401).json({ msg: "Invalid" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch); // 👈 debug

  if (!isMatch) return res.status(401).json({ msg: "Invalid" });

  const token = generateAccessToken(user._id, user.role, user.username);
  const refresh = generateRefreshToken(user._id, user.username);

  res.cookie("token", token, { httpOnly: true });
  res.cookie("refreshToken", refresh, { httpOnly: true, path: "/api/auth/refresh" });
  res.json({ user: { username: user.username, role: user.role } });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  res.json({ msg: "Logged out" });
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.id, decoded.role);
    res.cookie("token", newAccessToken, { httpOnly: true });
    res.send({ ok: true });
  } catch {
    res.sendStatus(403);
  }
});

// /api/auth/me
router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      user: {
        username: decoded.username, // ✅ must include this
        role: decoded.role,
        id: decoded.id,
      },
    });
  } catch {
    res.sendStatus(403);
  }
});


module.exports = router;
