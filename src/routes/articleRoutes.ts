import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import { Article, ArticleResponse } from "../interfaces/interfaces";
import { authenticateToken } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validateResource";
import {
  createArticleSchema,
  updateArticleSchema,
  patchArticleSchema,
  articleIdSchema,
} from "../schemas/article.schema";
import { checkArticleOwnership } from "../middlewares/articleMiddleware";

const router = Router();

// Get all articles
router.get("/", async (req, res, next) => {
  // users?page=1&limit=10

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  try {
    const [rows] = await pool.execute(
      "select * from articles limit ? offset ?",
      [limit.toString(), offset.toString()]
    );
    const articles = rows as Article[];
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

// Get article by ID
router.get("/:id", validate(articleIdSchema), async (req, res, next) => {
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
    next(error);
  }
});

// Create new article

router.post(
  "/",
  authenticateToken,
  validate(createArticleSchema),
  async (req, res, next) => {
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
      next(error);
    }
  }
);

// Update article
router.put(
  "/:id",
  authenticateToken,
  validate(updateArticleSchema),
  checkArticleOwnership,
  async (req, res, next) => {
    const articleId = Number(req.params.id);
    const { title, body, category } = req.body;

    try {
      await pool.execute(
        "update articles set title = ?, body = ?, category = ? where id = ?",
        [title, body, category, articleId]
      );

      const article: ArticleResponse = { id: articleId, title, body, category };

      res.json(article);
    } catch (error) {
      next(error);
    }
  }
);

// Update article partially
router.patch(
  "/:id",
  authenticateToken,
  validate(patchArticleSchema),
  checkArticleOwnership,
  async (req, res, next) => {
    const articleId = Number(req.params.id);
    const { title, body, category } = req.body;

    try {
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
      next(error);
    }
  }
);

// Delete article
router.delete(
  "/:id",
  authenticateToken,
  validate(articleIdSchema),
  checkArticleOwnership,
  async (req, res, next) => {
    const articleId = Number(req.params.id);

    try {
      await pool.execute("delete from articles where id = ?", [articleId]);

      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;