import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import { Article, ArticleResponse } from "../interfaces/interfaces";
import { validatePostId, validateRequiredPostData } from "../middlewares/postValidation";
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

// Get article by ID
router.get("/:id", validatePostId, async (req, res) => {
  try {
    const articleId = Number(req.params.id);

    const [rows] = await pool.execute("select * from articles where id = ?", [
      articleId,
    ]);
    const articles = rows as Article[];

    if (articles.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(articles[0]);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// Update article
router.put(
  "/:id",
  validatePostId,
  validateRequiredPostData,
  async (req, res) => {
    const articleId = Number(req.params.id);
    const { title, body, category } = req.body;

    try {
      const [result]: [ResultSetHeader, any] = await pool.execute(
        "update articles set title = ?, body = ?, category = ? where id = ?",
        [title, body, category, articleId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      const article: ArticleResponse = { id: articleId, title, body, category };

      res.json(article);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  }
);




export default router;