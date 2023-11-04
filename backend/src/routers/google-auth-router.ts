import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

import { UNABLE_TO_AUTHENTICATE } from "../constants";

const router = Router();

// Google OAuth Login
router.get("/login-fail", async (req: Request, res: Response) => {
  res.status(401).send({ message: UNABLE_TO_AUTHENTICATE });
});

// Google OAuth Logout
router.get(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
      res.status(200).send();
    });
  }
);

// Google OAuth Authentication
router.get(
  "/authenticate",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth Callback Route where the information is sent back
// Gets the code from the redirect URI and sends it to Google
// to get user info
router.get(
  "/redirect",
  passport.authenticate("google"),
  async (req: Request, res: Response) => {
    res.redirect(process.env.DEV_CLIENT_URL as string);
  }
);

export default router;
