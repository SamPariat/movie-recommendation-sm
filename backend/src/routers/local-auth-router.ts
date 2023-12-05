import * as argon from "argon2";
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

import { ErrorMessages, HttpStatus } from "../constants";
import { InternalServerError } from "../errors";
import MovieUser from "../models/movie-user";

const router = Router();

/**
 * @path GET /auth/local/signup
 * @summary Sign up a user
 * @description Allows the user to sign up using Passport Local
 * @returns {Object} The signed up user
 * @returns {403} If the user already exists
 * @throws {InternalServerError} If some error occurs
 */
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const movieUser = await MovieUser.findOne({
        email,
      });

      if (movieUser) {
        return res
          .status(HttpStatus.Forbidden)
          .json({ error: ErrorMessages.InvalidCredentials });
      }

      const hashedPassword = await argon.hash(password);

      const newMovieUser = new MovieUser({
        name,
        email,
        password: hashedPassword,
      });

      await newMovieUser.save();

      res.status(HttpStatus.Created).json(newMovieUser);
    } catch (e) {
      next(new InternalServerError(ErrorMessages.InternalServerError));
    }
  }
);

/**
 * @path GET /auth/local/login
 * @summary Log in a user
 * @description Allows the user to log in using Passport Local
 * @returns {Object} The logged in user
 * @throws {InternalServerError} If some error occurs
 */
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/local/login" }),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(req.user);
    } catch (e) {
      next(new InternalServerError(ErrorMessages.InternalServerError));
    }
  }
);

/**
 * @path GET /auth/local/logout
 * @summary Log out a user
 * @description Allows the user to logout
 */
router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
    });
    res.json();
  }
);

export default router;
