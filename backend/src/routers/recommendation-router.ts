import axios, { AxiosError } from "axios";
import { NextFunction, Request, Response, Router } from "express";

import { ErrorMessages } from "../constants";
import {
  ModelServerError,
  MovieDoesNotExistError,
  QueryInvalidError,
} from "../errors";
import { type MovieData } from "../types";
import {
  getMovieInformationById,
  retrieveRedisJson,
  storeRedisJson,
} from "../utils";

const router = Router();

/**
 * @path GET /model/recommendation/:movie
 * @summary Retrieve recommendations
 * @param {string} movie The title of the movie for which recommendations are to be retrieved
 * @returns {Object} The array of recommendations
 * @description Retrieves a list of recommendations based on the specified movie
 * @throws {QueryInvalidError} If no movie is provided
 * @throws {MovieDoesNotExistError} If the movie does not exist
 * @throws {ModelServerError} If the Flask backend is not working
 */
router.get(
  "/recommendation",
  async (req: Request, res: Response, next: NextFunction) => {
    const path = "$";
    let redisRecommendationPath = "recommendation:";

    try {
      const movie = req.query.movie;

      if (!movie) {
        throw new QueryInvalidError(ErrorMessages.NoMovieProvided);
      }

      redisRecommendationPath += movie.toString();

      const cachedRecommendations = await retrieveRedisJson(
        redisRecommendationPath,
        path
      );

      if (cachedRecommendations) {
        // Speeds up the request from appropriately 1400ms to 170ms (87.86%)
        return res.json({ recommendations: cachedRecommendations });
      }

      const response = await axios.get(
        `${process.env.MODEL_BASE_URL}/movie-prediction?movie=${movie}`
      );

      const predictedMovies: { id: number; title: string }[] = response.data;

      // Generate promises for each of the predicted movies
      const movieInfoPromise = predictedMovies.map(async (pred) => {
        const movieInfo = await getMovieInformationById(pred.id);
        return movieInfo ? { ...movieInfo, title: pred.title } : null;
      });

      // Run all the predictions in parallel to each other
      // and then filter out the null predictions
      const movieData = (await Promise.all(movieInfoPromise)).filter(
        (pred) => pred !== null
      ) as MovieData[];

      await storeRedisJson(redisRecommendationPath, path, movieData);

      res.json({ recommendations: movieData });
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 400) {
          next(new MovieDoesNotExistError(ErrorMessages.MovieDoesNotExist));
        } else if (e.response?.status === 500) {
          next(new ModelServerError(ErrorMessages.ModelServiceUnavailable));
        } else {
          next(e);
        }
      }
      next(e);
    }
  }
);

export default router;
