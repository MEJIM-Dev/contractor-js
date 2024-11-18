import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { Profile } from '../model/model';
import { ApiResponse, UserPayload } from '../dto/types';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(
        ApiResponse.error("Access token missing or invalid")
    );
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user as UserPayload;
    next();
  } catch (error) {
    return res.status(403).json(
        ApiResponse.error("Invalid or expired token")
    );
  }
}


export function generateToken (user: {}){
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
    return token;

}