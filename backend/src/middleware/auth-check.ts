import { NextFunction, Request, Response } from "express";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    // If the user is not logged in
    res.redirect("/auth/google/login");
  } else {
    // If the user is logged in
    next();
  }
};

export default authCheck;
