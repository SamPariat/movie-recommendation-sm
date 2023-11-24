import { AxiosError } from "axios";
import { NextFunction, Request, Response, Router } from "express";

import { ErrorMessages, HttpStatus } from "../constants";
import { ErrorFetchingReviews, QueryInvalidError } from "../errors";
import authCheck from "../middleware/auth-check";
import MovieReview from "../models/movie-review";
import { type IMovieUser } from "../models/movie-user";
import { saveReview } from "../utils";

const router = Router();

router.get(
  "/get-reviews/:movie",
  authCheck,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const movie = req.params.movie;

      if (!movie) {
        throw new QueryInvalidError(ErrorMessages.NoMovieProvided);
      }

      const reviews = await MovieReview.find({
        movie,
      })
        .limit(limit)
        .skip((page - 1) * limit);

      return res.json({ reviews });
    } catch (e) {
      if (e instanceof AxiosError) {
        next(new ErrorFetchingReviews(ErrorMessages.ErrorFetchingReviews));
      }

      next(e);
    }
  }
);

router.post(
  "/save-review/:movie",
  authCheck,
  async (req: Request, res: Response, next: NextFunction) => {
    const review = req.query.review;

    if (!review) {
      return res
        .status(HttpStatus.BadRequest)
        .send({ error: ErrorMessages.NoReviewProvided });
    }

    try {
      const user = req.user as IMovieUser;
      const movie = req.params.movie as string;

      const newReview = await saveReview(review as string, user._id, movie);

      return res.status(HttpStatus.Created).send(newReview);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
