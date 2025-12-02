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

// Create new article

router.post(
  "/",
  authenticateToken,
  validateRequiredPostData,
  async (req, res) => {
    const { title, body, category } = req.body;
    const userId = (req as any).user.id;

    try {
      const [result]: [ResultSetHeader, any] = await pool.execute(
        "insert into articles (title, body, category, submitted_by_user_id, created_at) values (?, ?, ?, ?, ?)",
        [title, body, category, userId, new Date()]
      );
      const newArticleId = result.insertId;

      const article: ArticleResponse = {
        id: newArticleId,
        title,
        body,
        category,
      };  
      res.status(201).json(article);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  }
);


// Update article
router.put(
  "/:id",
  validatePostId,
  authenticateToken,
  validateRequiredPostData,
  async (req, res) => {
    const articleId = Number(req.params.id);
    const userId = (req as any).user.id;
    const { title, body, category } = req.body;

    try {
      // Check if article exists and belongs to user
      const [rows] = await pool.execute(
        "select submitted_by_user_id from articles where id = ?",
        [articleId]
      );
      const articles = rows as any[];

      if (articles.length === 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (articles[0].submitted_by_user_id !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this article" });
      }

      const [result]: [ResultSetHeader, any] = await pool.execute(
        "update articles set title = ?, body = ?, category = ? where id = ?",
        [title, body, category, articleId]
      );

      const article: ArticleResponse = { id: articleId, title, body, category };

      res.json(article);
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  }
);

// Update article partially
router.patch(
  "/:id",
  validatePostId,
  authenticateToken,
  async (req, res) => {
    const articleId = Number(req.params.id);
    const userId = (req as any).user.id;
    const { title, body, category } = req.body;

    try {

      // Check if article exists and belongs to user
      const [rows] = await pool.execute(
        "select submitted_by_user_id from articles where id = ?",
        [articleId]
      );
      const articles = rows as any[];

      if (articles.length === 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (articles[0].submitted_by_user_id !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this article" });
      }

      const fieldsToUpdate: string[] = [];
      const values: any[] = [];
      if (title) {
        fieldsToUpdate.push("title = ?");
        values.push(title);
      }
      if (body) {
        fieldsToUpdate.push("body = ?");
        values.push(body);
      }
      if (category) {
        fieldsToUpdate.push("category = ?");
        values.push(category);
      }
      if (fieldsToUpdate.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one field (title, body, category) is required to update" });
      }
      values.push(articleId);

      const updateQuery = `update articles set ${fieldsToUpdate.join(
        ", "
      )} where id = ?`;

      await pool.execute(updateQuery, values);

      res.json({ message: "Article updated successfully" });
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  }
);

// Delete article
router.delete("/:id", validatePostId, authenticateToken, async (req, res) => {
  const articleId = Number(req.params.id);
  const userId = (req as any).user.id;

  try {
    // Check if article exists and belongs to user
    const [rows] = await pool.execute(
      "select submitted_by_user_id from articles where id = ?",
      [articleId]
    );
    const articles = rows as any[];

    if (articles.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (articles[0].submitted_by_user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this article" });
    }

    const [result]: [ResultSetHeader, any] = await pool.execute(
      "delete from articles where id = ?",
      [articleId]
    );
    
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;