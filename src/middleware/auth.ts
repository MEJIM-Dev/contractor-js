import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { AccessTokenDto, ApiResponse, AuthObject, LoggedInUser, LoggedInUserImpl } from '../dto/types';
import { findById } from '../db/user';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.SECRET_KEY || 'secret';
const REFRESH_TOKEN_SECRET = process.env.SECRET_KEY || 'secret';

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.debug(token)

  if (!token) {
    return res.status(401).json(
        ApiResponse.error("Access token missing or invalid")
    );
  }

  try {
    const user = verifyAccessToken(token);

    const profile = await findById(user.id);
    if (!profile) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUser = new LoggedInUserImpl();
    loggedInUser.username = user.email;
    loggedInUser.id = user.id

    req.user = loggedInUser as LoggedInUser;

    next();
  } catch (error) {
    console.error(error)
    return res.status(403).json(
        ApiResponse.error("Invalid or expired token")
    );
  }
}

export function verifyAccessToken(token: string){
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return user as AuthObject; 
}

export function generateToken (user: AuthObject): AccessTokenDto{
    const plainObject: {} = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.type
    };
    console.log(plainObject)
    const accessToken = generateAccessToken(plainObject);
    const refreshToken = generateRefreshToken(plainObject);
    const res: AccessTokenDto = {"accessToken": accessToken, "refreshToken": refreshToken};
    return res;
}

export function generateAccessToken (user: {}): string{
    const token = jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return token;
}

export function generateRefreshToken (user: {}): string{
    const token = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return token;
}

export function refreshAccessToken(refreshToken: string): AccessTokenDto {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as AuthObject;
  
      return generateToken(decoded);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }