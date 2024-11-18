import { NextFunction, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { getAppRoutes } from "../config/routepermissions";
import { match } from 'path-to-regexp';

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("[+] Request to url: ", req.originalUrl)
      const routes = getAppRoutes();

      // Match the request URL against the configured routes
      const route = routes.find((r) => {
        const matcher = match(r.url, { decode: decodeURIComponent });
        const matched = matcher(req.url);
        return matched && (!r.method || r.method === req.method);
      });

      if (!route) {
        res.status(404).json({ message: 'Route not found.' });
        return;
      }

      if (!route.authenticationRequired) {
        next(); // If authentication is not required, skip checks
        return;
      }
      const decoded = authenticateToken(req, res, next);

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token. Unauthorized.' });
    }
  }