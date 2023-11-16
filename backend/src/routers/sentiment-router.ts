import { AxiosError } from "axios";
import { Request, Response, Router } from "express";

import { ErrorMessages, HttpStatus } from "../constants";
import { ErrorFetchingReviewSentiment, ModelServerError } from "../errors";
import authCheck from "../middleware/auth-check";
import MovieReview from "../models/movie-review";
import { type IMovieUser } from "../models/movie-user";
import { saveReview } from "../utils";

const router = Router();

router.get(
  "/get-reviews/:movie",
  authCheck,
  async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const movie = req.params.movie;

      const reviews = await MovieReview.find({
        movie,
      })
        .limit(limit)
        .skip((page - 1) * limit);

      return res.json({ reviews });
    } catch (e) {
      if (e instanceof AxiosError) {
        return res
          .status(HttpStatus.BadRequest)
          .send({ error: ErrorMessages.ErrorFetchingReviews });
      }
      res.status(HttpStatus.InternalServerError).send();
    }
  }
);

router.post(
  "/save-review/:movie",
  authCheck,
  async (req: Request, res: Response) => {
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
      if (e instanceof ModelServerError) {
        return res.status(HttpStatus.InternalServerError).send();
      } else if (e instanceof ErrorFetchingReviewSentiment) {
        return res
          .status(HttpStatus.ServiceUnavailable)
          .send({ error: e.message });
      }
      res.status(HttpStatus.InternalServerError).send();
    }
  }
);

export default router;
