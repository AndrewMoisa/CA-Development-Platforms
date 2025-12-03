import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { pool } from "../config/database.js";
import { Article, ArticleResponse } from "../interfaces/interfaces.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateResource.js";
import {
  createArticleSchema,
  updateArticleSchema,
  patchArticleSchema,
  articleIdSchema,
} from "../schemas/article.schema.js";
import { checkArticleOwnership } from "../middlewares/articleMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management endpoints
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   body:
 *                     type: string
 *                   category:
 *                     type: string
 *                   submitted_by_user_id:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 body:
 *                   type: string
 *                 category:
 *                   type: string
 *                 submitted_by_user_id:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               body:
 *                 type: string
 *                 minLength: 10
 *               category:
 *                 type: string
 *                 minLength: 3
 *     responses:
 *       201:
 *         description: Article created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Update an article completely
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               body:
 *                 type: string
 *                 minLength: 10
 *               category:
 *                 type: string
 *                 minLength: 3
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Partially update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               body:
 *                 type: string
 *                 minLength: 10
 *               category:
 *                 type: string
 *                 minLength: 3
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       400:
 *         description: At least one field is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the owner
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
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