import { NextFunction, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { getAppRoutes } from "../config/routepermissions";
import { match } from 'path-to-regexp';
import { isMethodValid, removeQueryString } from "../util/auth";
import { ApiResponse, ExtendedHttpReuestMethods } from "../dto/types";

export function isAuthorized(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("[+] Request to url: ", req.originalUrl, "method: ", req.method);
    const url = removeQueryString(req.originalUrl)

    // Get the configured routes
    const routes = getAppRoutes();

    // Match the request URL against the configured routes
    const route = routes.find((r) => {
      // console.log("Checking route: ", r); // Log each route as it's being checked
      const matcher = match(r.url, { decode: decodeURIComponent });
      const matched = matcher(url); // Use req.path here

      // Log if the route matches
      // console.log(`Matching ${url} with route ${r.url}: `, matched);

      // If route doesn't match, return false
      if (!matched) return false;

      // Check if the method matches (also considering that it may be undefined)
      if (r.method && isMethodValid(req.method)) {
        // console.log(`Checking method: ${r.method} with ${req.method}`);
        return r.method === ExtendedHttpReuestMethods[req.method];
      }

      return true; // Allow matching if no specific method is required
    });

    // If no matching route found, log the issue and return 404
    if (!route) {
      console.log("Route not found for:", req.path);
      res.status(404).json(ApiResponse.error('Route not found.' ));
      return;
    }

    // If authentication is required, proceed with authentication
    if (route.authenticationRequired) {
      authenticateToken(req, res, next);
      return;
    }

    next()

  } catch (error) {
    console.error("Error in isAuthorized:", error);
    res.status(500).json(
      ApiResponse.error("Internal Server Error")
    )
  }
}


// export function isAuthorized(req: Request, res: Response, next: NextFunction) {
//     try {
//       console.log("[+] Request to url: ", req.originalUrl, "method: ", req.method)
//       const routes = getAppRoutes();

//       // Match the request URL against the configured routes
//       const route = routes.find((r) => {
//         console.log(route)
//         const matcher = match(r.url, { decode: decodeURIComponent });
//         const matched = matcher(req.path); // Use req.path here
  
//         // Check if the method is valid before comparing
//         if (!matched) return false;
  
//         if (r.method && isMethodValid(req.method)) {
//           return r.method === ExtendedHttpReuestMethods[req.method];
//         }
  
//         return false;
//       });

//       if (!route) {
//         res.status(404).json({ message: 'Route not found.' });
//         return;
//       }

//       if (!route.authenticationRequired) {
//         next(); // If authentication is not required, skip checks
//         return;
//       }
//       const decoded = authenticateToken(req, res, next);

//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Invalid token. Unauthorized.' });
//     }
//   }