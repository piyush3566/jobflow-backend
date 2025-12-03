import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db.js";

const router = express.Router();

// helper: create JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },             // payload
    process.env.JWT_SECRET,                         // secret
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // check if user already exists
    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    // hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // insert user
    const insertRes = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    const user = insertRes.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      user,
      token
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
console.log("JWT_SECRET present?", !!process.env.JWT_SECRET);


// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // find user
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // create token
    const token = generateToken(user);

    // remove password_hash before sending
    delete user.password_hash;

    res.json({
      user,
      token
    });
  } catch (err) {
  console.error("Register error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message   // 👈 add this line
  });
}
});

export default router;
