import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database";

export async function checkArticleOwnership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const articleId = Number(req.params.id);
  const userId = (req as any).user.id;

  try {
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
        .json({ error: "You are not authorized to perform this action on this article" });
    }

    next();
  } catch (error) {
    console.error("Error checking ownership", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
