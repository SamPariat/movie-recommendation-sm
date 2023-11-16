import axios, { AxiosError } from "axios";
import { Request, Response, Router } from "express";

import { ErrorMessages, HttpStatus } from "../constants";
import authCheck from "../middleware/auth-check";
import MovieReview from "../models/movie-review";
import { IMovieUser } from "../models/movie-user";

const router = Router();

const modelBaseUrl = process.env.MODEL_BASE_URL;

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

    try {
      if (!review) {
        return res
          .status(HttpStatus.BadRequest)
          .send({ error: ErrorMessages.NoReviewProvided });
      }

      const user = req.user as IMovieUser;
      const movie = req.params.movie as string;

      const response = await axios.get<{ sentiment: string }>(
        `${modelBaseUrl}/sentiment?review=${review}`
      );

      if (response.status === 500) {
        return res
          .status(HttpStatus.InternalServerError)
          .send({ error: ErrorMessages.ErrorFetchingSentiment });
      }

      const { sentiment } = response.data;

      const newReview = new MovieReview({
        review,
        sentiment,
        movie,
        movieUser: user?._id,
      });

      await newReview.save();

      return res.status(HttpStatus.Created).send(newReview);
    } catch (e) {
      if (e instanceof AxiosError) {
        return res.status(HttpStatus.BadRequest).send({ error: e.message });
      }
      res.status(HttpStatus.InternalServerError).send();
    }
  }
);

export default router;
