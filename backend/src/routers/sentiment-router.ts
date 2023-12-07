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
import MovieReview from "../models/movie-review";
import { saveReview, sentimentData, sentimentDataOfMovie } from "../utils";

const router = Router();

/**
 * @path GET /sentiment/review-analytics/:movie
 * @summary Retrieve the review analytics
 * @param {string} movie The title of the movie for which analytics are to be retrieved
 * @returns {Object} The array of analytics
 * @description Retrieves a list of analytics for each movie based on the sentiment
 * @throws {QueryInvalidError} If no movie is provided
 * @throws {ErrorFetchingReviews} If any error occurs
 */
router.get(
  "/review-analytics/:movie",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movie = req.params.movie;

      if (!movie) {
        throw new QueryInvalidError(ErrorMessages.NoMovieProvided);
      }

      const reviewAnalytics = await sentimentDataOfMovie(movie);

      res.json({ reviewAnalytics });
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/review-analytics/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewAnalytics = await sentimentData();

      res.json({ reviewAnalytics });
    } catch (e) {
      next(e);
    }
  }
);

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
  // authCheck,
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
  // authCheck,
  async (req: Request, res: Response, next: NextFunction) => {
    const movie = req.params.movie as string;
    const { name, review } = req.body as { name: string; review: string };

    if (!movie) {
      throw new QueryInvalidError(ErrorMessages.NoMovieProvided);
    }

    if (!review || review.length === 0 || !name || name.length === 0) {
      throw new NoReviewProvidedError(ErrorMessages.NoReviewProvided);
    }

    try {
      // const user = req.user as IMovieUser;

      // const newReview = await saveReview(review as string, user._id, movie);
      const newReview = await saveReview(review, name, movie);

      return res.status(HttpStatus.Created).json(newReview);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
