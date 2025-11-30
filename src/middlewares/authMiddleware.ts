import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Access token required (Bearer <token>)", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    
    if (!payload) {
      return next(new AppError("Invalid or expired token", 401));
    }

    // Attach user to request
    (req as AuthRequest).user = { id: payload.userId };
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
}