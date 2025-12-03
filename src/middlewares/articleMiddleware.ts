import { Request, Response, NextFunction } from "express";
import { pool } from "../config/database.js";
import { AppError } from "../utils/AppError.js";

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
      return next(new AppError("Article not found", 404));
    }

    if (articles[0].submitted_by_user_id !== userId) {
      return next(
        new AppError(
          "You are not authorized to perform this action on this article",
          403
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
