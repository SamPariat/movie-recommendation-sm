import * as argon from "argon2";
import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

import { ErrorMessages, HttpStatus } from "../constants";
import MovieUser from "../models/movie-user";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const movieUser = await MovieUser.findOne({
      email,
    });

    if (movieUser) {
      res
        .status(HttpStatus.Forbidden)
        .send({ error: ErrorMessages.InvalidCredentials });
    }

    const hashedPassword = await argon.hash(password);

    const newMovieUser = new MovieUser({
      name,
      email,
      password: hashedPassword,
    });

    await newMovieUser.save();
    res.status(HttpStatus.Created).send();
  } catch (e) {
    res.status(HttpStatus.InternalServerError).send();
  }
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/local/login" }),
  (req: Request, res: Response) => {
    try {
      res.status(HttpStatus.Ok).send({ user: req.user });
    } catch (e) {
      res.status(HttpStatus.InternalServerError).send();
    }
  }
);

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
    });
    res.status(HttpStatus.Ok).send();
  }
);

export default router;
