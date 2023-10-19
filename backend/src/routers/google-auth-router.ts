import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

const router = Router();

// Google OAuth Login
router.post("/login", async (req: Request, res: Response) => {
  res.render("login");
});

// Google OAuth Logout
router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
      res.status(200).send("Logged out...");
    });
  }
);

// Google OAuth Authentication
router.get(
  "/auth-data",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
  async (req: Request, res: Response) => {
    console.log("Auth data");
  }
);

// Google OAuth Callback Route where the information is sent back
// Gets the code from the redirect URI and sends it to Google
// to get user info
router.get(
  "/redirect",
  passport.authenticate("google"),
  async (req: Request, res: Response) => {
    res.redirect("/profile");
  }
);

export default router;
