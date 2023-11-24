import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";

import { ErrorMessages } from "../constants";
import { NoMoviesError } from "../errors";
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

router.get("/info", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id as string;
    const movieInfo = await getMovieInformationById(+id);

    res.send(movieInfo);
  } catch (e) {
    next(e);
  }
});

router.get("/cast", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id as string;
    const castInfo = await getMovieCastById(+id);

    res.send(castInfo);
  } catch (e) {
    next(e);
  }
});

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
