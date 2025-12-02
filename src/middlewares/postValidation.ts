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

