import axios from "axios";
import { Request, Response, Router } from "express";

import {
  ERROR_FETCHING_MOVIE_INFORMATION,
  INTERNAL_SERVER_ERROR,
  MOVIE_DOES_NOT_EXIST,
  NO_MOVIE_PROVIDED,
} from "../constants";
import { MovieInfo, getMovieInformationById } from "../utils/movie-utils";

const router = Router();

interface MovieData extends MovieInfo {
  title: string;
}

router.get("/recommendation", async (req: Request, res: Response) => {
  try {
    const movie = req.query.movie;

    if (!movie) {
      return res.status(400).send({ error: NO_MOVIE_PROVIDED });
    }

    const response = await axios.get(
      `http://127.0.0.1:3524/movie-prediction?movie=${movie}`
    );

    if (response.status === 400) {
      return res.status(400).send({ error: MOVIE_DOES_NOT_EXIST });
    }

    const predictedMovies: { id: number; title: string }[] = response.data;
    const movieData: MovieData[] = [];

    for (const movie of predictedMovies) {
      const movieInfo = await getMovieInformationById(movie.id);

      if (movieInfo) {
        movieData.push({ ...movieInfo, title: movie.title });
      }
    }

    res.status(200).send(movieData);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (e.message === ERROR_FETCHING_MOVIE_INFORMATION) {
        return res.status(400).send({ error: MOVIE_DOES_NOT_EXIST });
      }
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

export default router;
