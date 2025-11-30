import { Request, Response, NextFunction } from 'express';

export function validatePostId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid post id" });
  }

  next();
}

export function validateRequiredPostData(
  req: Request,
    res: Response,
    next: NextFunction
) {
  const { title, body, category } = req.body;
    if (!title || !body || !category) {
    return res
      .status(400)
      .json({ error: "Title, body, and category are required" });
  }
    next();
}   