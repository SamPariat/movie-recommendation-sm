import axios, { AxiosError } from "axios";
import { Request, Response, Router } from "express";

import {
  ERROR_FETCHING_MOVIE_INFORMATION,
  ERROR_FETCHING_TRENDING_MOVIES,
  INTERNAL_SERVER_ERROR,
  INVALID_MOVIE_ID,
  MOVIE_DOES_NOT_EXIST,
  NO_MOVIES,
  UNAUTHORIZED,
} from "../constants";
import {
  getMovieCastById,
  getLatestTrendingMovie,
  getTop5Trending,
} from "../utils/movie-utils";

const router = Router();

router.get("/cast", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const castInfo = await getMovieCastById(parseInt(id));

    res.status(200).send(castInfo);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (e.message === ERROR_FETCHING_MOVIE_INFORMATION) {
        return res.status(404).send({ error: MOVIE_DOES_NOT_EXIST });
      } else if (e.message === INVALID_MOVIE_ID) {
        return res.status(400).send({ error: INVALID_MOVIE_ID });
      } else if (e.message === UNAUTHORIZED) {
        return res.status(401).send({ error: UNAUTHORIZED });
      }
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${process.env.MODEL_BASE_URL}/all-movies`
    );

    const allMovies = response.data;
    if (!allMovies) {
      throw new AxiosError(NO_MOVIES);
    }

    res.status(200).send(allMovies);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (e.message === NO_MOVIES) {
        return res.status(404).send({ error: NO_MOVIES });
      }
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

router.get("/latest-trending", async (req: Request, res: Response) => {
  try {
    const latestTrending = await getLatestTrendingMovie();

    res.status(200).send(latestTrending);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (e.message === ERROR_FETCHING_MOVIE_INFORMATION) {
        return res.status(404).send({ error: ERROR_FETCHING_TRENDING_MOVIES });
      }
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

router.get("/top-5-trending", async (req: Request, res: Response) => {
  try {
    const top5Trending = await getTop5Trending();

    return res.status(200).send({ top5Trending });
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (e.message === ERROR_FETCHING_MOVIE_INFORMATION) {
        return res.status(404).send({ error: ERROR_FETCHING_TRENDING_MOVIES });
      }
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

export default router;
