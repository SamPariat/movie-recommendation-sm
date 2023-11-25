import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";

import { ErrorMessages } from "../constants";
import {
  ErrorFetchingCast,
  ErrorFetchingMovieInformation,
  MovieDoesNotExistError,
  NoMoviesError,
  QueryInvalidError,
  UnauthorizedError,
} from "../errors";
import {
  getLatestTrendingMovie,
  getMovieCastById,
  getMovieInformationById,
  getTop5Trending,
  retrieveRedisJson,
  storeRedisJson,
} from "../utils";

const router = Router();

const modelBaseUrl = process.env.MODEL_BASE_URL;

/**
 * @path GET /movie/info?id=:id
 * @summary Get information about a movie
 * @param {string} movie The title of the movie for which information is to be retrieved
 * @returns {Object} The information about the movie
 * @description Gets the information about the movie after interacting with the TMDB API
 * @throws {QueryInvalidError} If no movie is provided
 * @throws {UnauthorizedError} If the API key is invalid
 * @throws {MovieDoesNotExistError} If the movie does not exist
 * @throws {ErrorFetchingMovieInformation} If any other error is encountered
 */
router.get("/info", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id as string;

    if (!id) {
      throw new QueryInvalidError(ErrorMessages.NoMovieProvided);
    }

    const movieInfo = await getMovieInformationById(+id);

    res.send(movieInfo);
  } catch (e) {
    next(e);
  }
});

/**
 * @path GET /movie/cast?id=:id
 * @summary Get the actors and directors
 * @param {string} id The TMDB id of the movie
 * @returns {Object} The cast and crew of the movie
 * @description Gets the actors and the director of the movie after interacting with the TMDB API
 * @throws {QueryInvalidError} If no movie is provided
 * @throws {UnauthorizedError} If the API key is invalid
 * @throws {MovieDoesNotExistError} If the movie does not exist
 * @throws {ErrorFetchingCast} If any other error is encountered
 */
router.get("/cast", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id as string;

    if (!id) {
      throw new QueryInvalidError(ErrorMessages.NoMovieProvided);
    }

    const castInfo = await getMovieCastById(+id);

    res.send(castInfo);
  } catch (e) {
    next(e);
  }
});

/**
 * @path GET /movie/all
 * @summary Get all movies
 * @returns {Object} An array of all movies received
 * @description Gets all the movies from the Flask backend (if not cached), otherwise from the Redis Stack (after caching)
 * @throws {NoMoviesError} If the result is a null value
 * @throws {Error} If any other error is encountered
 */
router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  const redisMoviePath = "movies:dicc_arr";
  const path = "$";

  try {
    const cachedMovies = await retrieveRedisJson(redisMoviePath, path);

    if (cachedMovies) {
      // Speeds up the request from appropriately 2000ms to 650ms (67.5%)
      return res.send({ dicc_arr: cachedMovies });
    }

    const response = await axios.get(`${modelBaseUrl}/all-movies`);

    const allMovies: { dicc_arr: { id: number; title: string }[] } =
      response.data;

    if (!allMovies) {
      throw new NoMoviesError(ErrorMessages.NoMovies);
    }

    await storeRedisJson(redisMoviePath, path, allMovies.dicc_arr);

    res.send(allMovies);
  } catch (e) {
    next(e);
  }
});

/**
 * @path GET /movie/latest-trending
 * @summary Get the latest trending movie
 * @returns {Object} The latest trending movie
 * @description Gets the information about the latest trending movie after interacting with the TMDB API
 * @throws {UnauthorizedError} If the API key is invalid
 * @throws {MovieDoesNotExistError} If the movie does not exist
 * @throws {ErrorFetchingMovieInformation} If any other error is encountered
 */
router.get(
  "/latest-trending",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latestTrending = await getLatestTrendingMovie();

      res.send(latestTrending);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @path GET /movie/top-5-trending
 * @summary Get the top 5 trending movies
 * @returns {Object} Containing an array of the top 5 trending movies
 * @description Gets the information about the top 5 trending movies (actually 2-6) after interacting with the TMDB API
 * @throws {UnauthorizedError} If the API key is invalid
 * @throws {MovieDoesNotExistError} If the movie does not exist
 * @throws {ErrorFetchingMovieInformation} If any other error is encountered
 */
router.get(
  "/top-5-trending",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const top5Trending = await getTop5Trending();

      return res.send({ top5Trending });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
