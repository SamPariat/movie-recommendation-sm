import axios, { AxiosError } from "axios";
import { Request, Response, Router } from "express";

import { ErrorMessages, HttpStatus } from "../constants";
import {
  ErrorFetchingMovieInformation,
  InvalidMovieIdError,
  MovieDoesNotExistError,
  NoMoviesError,
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

router.get("/info", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const movieInfo = await getMovieInformationById(+id);

    res.status(HttpStatus.Ok).send(movieInfo);
  } catch (e) {
    if (e instanceof InvalidMovieIdError) {
      return res.status(HttpStatus.BadRequest).send({ error: e.message });
    } else if (e instanceof UnauthorizedError) {
      return res.status(HttpStatus.Unauthorized).send({ error: e.message });
    } else if (e instanceof MovieDoesNotExistError) {
      return res.status(HttpStatus.NotFound).send({ error: e.message });
    } else if (e instanceof ErrorFetchingMovieInformation) {
      return res.status(HttpStatus.NotFound).send({ error: e.message });
    }
    res.status(HttpStatus.InternalServerError).send();
  }
});

router.get("/cast", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const castInfo = await getMovieCastById(+id);

    res.status(HttpStatus.Ok).send(castInfo);
  } catch (e) {
    if (e instanceof MovieDoesNotExistError) {
      return res
        .status(HttpStatus.NotFound)
        .send({ error: ErrorMessages.MovieDoesNotExist });
    } else if (e instanceof ErrorFetchingMovieInformation) {
      return res
        .status(HttpStatus.NotFound)
        .send({ error: ErrorMessages.ErrorFetchingMovieInformation });
    } else if (e instanceof AxiosError) {
      if (e.message === ErrorMessages.InvalidMovieId) {
        return res
          .status(HttpStatus.BadRequest)
          .send({ error: ErrorMessages.InvalidMovieId });
      } else if (e.message === ErrorMessages.Unauthorized) {
        return res
          .status(HttpStatus.Unauthorized)
          .send({ error: ErrorMessages.Unauthorized });
      }
    }
    res.status(HttpStatus.InternalServerError).send();
  }
});

router.get("/all", async (req: Request, res: Response) => {
  const redisMoviePath = "movies:dicc_arr";
  const path = "$";

  try {
    const cachedMovies = await retrieveRedisJson(redisMoviePath, path);

    if (cachedMovies) {
      // Speeds up the request from appropriately 2000ms to 650ms (67.5%)
      return res.status(HttpStatus.Ok).send({ dicc_arr: cachedMovies });
    }

    const response = await axios.get(`${modelBaseUrl}/all-movies`);

    const allMovies: { dicc_arr: { id: number; title: string }[] } =
      response.data;
    if (!allMovies) {
      throw new NoMoviesError(ErrorMessages.NoMovies);
    }

    await storeRedisJson(redisMoviePath, path, allMovies.dicc_arr);

    res.status(HttpStatus.Ok).send(allMovies);
  } catch (e) {
    console.log(e);
    if (e instanceof NoMoviesError) {
      return res.status(HttpStatus.NotFound).send({ error: e.message });
    }
    res.status(HttpStatus.InternalServerError).send();
  }
});

router.get("/latest-trending", async (req: Request, res: Response) => {
  try {
    const latestTrending = await getLatestTrendingMovie();

    res.status(HttpStatus.Ok).send(latestTrending);
  } catch (e) {
    if (e instanceof ErrorFetchingMovieInformation) {
      return res.status(HttpStatus.NotFound).send({ error: e.message });
    }
    res.status(HttpStatus.InternalServerError).send();
  }
});

router.get("/top-5-trending", async (req: Request, res: Response) => {
  try {
    const top5Trending = await getTop5Trending();

    return res.status(HttpStatus.Ok).send({ top5Trending });
  } catch (e) {
    if (e instanceof ErrorFetchingMovieInformation) {
      return res.status(HttpStatus.NotFound).send({ error: e.message });
    }
    res.status(HttpStatus.InternalServerError).send();
  }
});

export default router;
