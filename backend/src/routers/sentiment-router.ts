import { AxiosError } from "axios";
import { NextFunction, Request, Response, Router } from "express";

import { ErrorMessages, HttpStatus } from "../constants";
import {
  ErrorFetchingReviewSentiment,
  ErrorFetchingReviews,
  ModelServerError,
  NoReviewProvidedError,
  QueryInvalidError,
} from "../errors";
import authCheck from "../middleware/auth-check";
import MovieReview from "../models/movie-review";
import { type IMovieUser } from "../models/movie-user";
import { saveReview } from "../utils";

const router = Router();

/**
 * @path GET /sentiment/get-reviews/:movie?limit=:limit&page=:page
 * @summary Retrieve the reviews
 * @param {string} movie The title of the movie for which reviews are to be retrieved
 * @param {string} page The page number for pagination
 * @param {string} limit The maximum number of reviews to be retrieved
 * @returns {Object} The array of reviews
 * @description Retrieves a list of reviews based on the specified movie
 * @throws {QueryInvalidError} If no movie is provided
 * @throws {ErrorFetchingReviews} If any error occurs
 */
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

/**
 * @path POST /sentiment/save-review/:movie?review=:review
 * @summary Save a review
 * @param {string} movie The title of the movie for which reviews are to be saved
 * @returns {Object} The review saved
 * @description Stores a review after processing the sentiment from the Flask backend
 * @throws {QueryInvalidError} If no movie is provided
 * @throws {NoReviewProvidedError} If no review is provided
 * @throws {ErrorFetchingReviewSentiment} If the Flask backend server responds with a 500
 * @throws {ModelServerError} If there is some other error
 */
router.post(
  "/save-review/:movie",
  authCheck,
  async (req: Request, res: Response, next: NextFunction) => {
    const movie = req.params.movie;

    if (!movie) {
      throw new QueryInvalidError(ErrorMessages.NoMovieProvided);
    }

    const review = req.query.review;

    if (!review) {
      throw new NoReviewProvidedError(ErrorMessages.NoReviewProvided);
    }

    try {
      const user = req.user as IMovieUser;
      const movie = req.params.movie as string;

      const newReview = await saveReview(review as string, user._id, movie);

      return res.status(HttpStatus.Created).json(newReview);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
