import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

import { ErrorMessages, HttpStatus } from "../constants";

const router = Router();

// Google OAuth Login
/**
 * @path GET /auth/google/login-fail
 * @summary Failed login route
 * @description The fallback route in case login fails
 * @returns {401} If authentication fails
 */
router.get("/login-fail", async (req: Request, res: Response) => {
  res
    .status(HttpStatus.Unauthorized)
    .json({ message: ErrorMessages.UnableToAuthenticate });
});

// Google OAuth Logout
/**
 * @path GET /auth/google/logout
 * @summary Logout a user
 * @description Allows the user to logout
 */
router.get(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
      res.json();
    });
  }
);

// Google OAuth Authentication
/**
 * @path GET /auth/google/authenticate
 * @summary Authenticate a user
 * @description Allows the user to authenticate using Passport Google OAuth 2.0
 */
router.get(
  "/authenticate",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth Callback Route where the information is sent back
// Gets the code from the redirect URI and sends it to Google
// to get user info
/**
 * @path GET /auth/google/redirect
 * @summary Redirect
 * @description Redirects from this route after getting information from Google
 */
router.get(
  "/redirect",
  passport.authenticate("google"),
  async (req: Request, res: Response) => {
    res.redirect(process.env.DEV_CLIENT_URL as string);
  }
);

export default router;
