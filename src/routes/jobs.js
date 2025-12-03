import express from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All routes here are protected
router.use(requireAuth);

/**
 * GET /api/jobs
 * List all jobs for the logged-in user
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT *
       FROM job_applications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /api/jobs
 * Create a new job application
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company,
      role,
      location,
      jobUrl,
      source,
      status,
      appliedOn,
      nextStepDate,
      nextStepType,
      expectedSalary,
      offeredSalary,
      tags,
      notes
    } = req.body;

    if (!company || !role || !status) {
      return res
        .status(400)
        .json({ message: "company, role and status are required" });
    }

    const insertRes = await query(
      `INSERT INTO job_applications
       (user_id, company, role, location, job_url, source, status,
        applied_on, next_step_date, next_step_type,
        expected_salary, offered_salary, tags, notes)
       VALUES
       ($1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10,
        $11, $12, $13, $14)
       RETURNING *`,
      [
        userId,
        company,
        role,
        location || null,
        jobUrl || null,
        source || null,
        status,
        appliedOn || null,
        nextStepDate || null,
        nextStepType || null,
        expectedSalary || null,
        offeredSalary || null,
        tags || null,
        notes || null
      ]
    );

    res.status(201).json(insertRes.rows[0]);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
