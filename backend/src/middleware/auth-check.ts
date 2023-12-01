import { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../errors";

/**
 * A middleware function that checks if the user is authenticated
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @throws 401 status code when user is not authenticated
 */
const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    // If the user is not logged in
    throw new UnauthorizedError("Not authenticated...");
  } else {
    // If the user is logged in
    next();
  }
};

export default authCheck;
