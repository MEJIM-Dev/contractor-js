import { NextFunction, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
    console.log(req.url)
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
  
    try {
      const decoded = authenticateToken(req, res, next);

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token. Unauthorized.' });
    }
  }