import { NextFunction, Request, Response } from "express";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    // If the user is not logged in
    return res.status(401).send({ message: "Not authenticated..." });
  } else {
    // If the user is logged in
    next();
  }
};

export default authCheck;
