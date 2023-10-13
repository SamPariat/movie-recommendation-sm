import { Router } from "express";
import passport from "passport";

const router = Router();

// Google OAuth Login
router.get("/login", async (req, res) => {
  res.render("login");
});

// Google OAuth Logout
router.get("/logout", async (req, res) => {});

// Google OAuth Authentication
router.get(
  "/auth-data",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
  async (req, res) => {
    console.log("Auth data");
  }
);

// Google OAuth Callback Route where the information is sent back
// Gets the code from the redirect URI and sends it to Google
// to get user info
router.get("/redirect", passport.authenticate("google"), async (req, res) => {
  res.json({ message: "hello" });
});

export default router;
