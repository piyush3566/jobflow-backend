import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const dbRes = await query("SELECT NOW() as now");
    res.json({
      status: "ok",
      message: "JobFlow backend is healthy",
      dbTime: dbRes.rows[0].now,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("DB health check failed:", err);
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: err.message,        // 👈 add this line
      code: err.code || null     // 👈 and this (optional, but helpful)
    });
  }
});

export default router;
