import axios from "axios";
import { Request, Response, Router } from "express";

import { ErrorMessages, HttpStatus } from "../constants";
import {
  ErrorFetchingMovieInformation,
  InvalidMovieIdError,
  MovieDoesNotExistError,
  UnauthorizedError,
} from "../errors";
import { type MovieData } from "../types";
import {
  getMovieInformationById,
  retrieveRedisJson,
  storeRedisJson,
} from "../utils";

const router = Router();

const modelBaseUrl = process.env.MODEL_BASE_URL;

router.get("/recommendation", async (req: Request, res: Response) => {
  const path = "$";
  let redisRecommendationPath = "recommendation:";

  try {
    const movie = req.query.movie;

    if (!movie) {
      return res
        .status(HttpStatus.BadRequest)
        .send({ error: ErrorMessages.NoMovieProvided });
    }

    redisRecommendationPath += movie.toString();

    const cachedRecommendations = await retrieveRedisJson(
      redisRecommendationPath,
      path
    );

    if (cachedRecommendations) {
      // Speeds up the request from appropriately 1400ms to 170ms (87.86%)
      res
        .status(HttpStatus.Ok)
        .send({ recommendations: cachedRecommendations });
    }

    const response = await axios.get(
      `${modelBaseUrl}/movie-prediction?movie=${movie}`
    );

    if (response.status === 400) {
      return res
        .status(HttpStatus.BadRequest)
        .send({ error: ErrorMessages.MovieDoesNotExist });
    } else if (response.status === 500) {
      return res
        .status(HttpStatus.ServiceUnavailable)
        .send({ error: ErrorMessages.ModelServiceUnavailable });
    }

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

    res.status(HttpStatus.Ok).send({ recommendations: movieData });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return res.status(HttpStatus.Unauthorized).send({ error: e.message });
    } else if (e instanceof InvalidMovieIdError) {
      return res.status(HttpStatus.BadRequest).send({ error: e.message });
    } else if (e instanceof MovieDoesNotExistError) {
      return res.status(HttpStatus.NotFound).send({ error: e.message });
    } else if (e instanceof ErrorFetchingMovieInformation) {
      return res.status(HttpStatus.BadRequest).send({ error: e.message });
    }
    res.status(HttpStatus.InternalServerError).send();
  }
});

export default router;
