import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import { Article } from "../interfaces/interfaces";
import {
  validatePartialUserData,
  validateRequiredUserData,
  validateUserId,
} from "../middlewares/userValidation";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// Get all articles
router.get("/", async (req, res) => {
  // users?page=1&limit=10

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  console.log("page ", page);
  console.log("limit ", limit);
  console.log("offset ", offset);

  try {
    const [rows] = await pool.execute("select * from articles limit ? offset ?", [
      limit.toString(),
      offset.toString(),
    ]);
    const articles = rows as Article[];
    res.json(articles);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

export default router;