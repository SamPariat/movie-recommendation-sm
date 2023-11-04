import axios, { AxiosError } from "axios";
import { Request, Response, Router } from "express";

import {
  ERROR_FETCHING_MOVIE_INFORMATION,
  INTERNAL_SERVER_ERROR,
  INVALID_MOVIE_ID,
  MOVIE_DOES_NOT_EXIST,
  NO_MOVIES,
  UNAUTHORIZED,
} from "../constants";
import { getMovieCastById } from "../utils/movie-utils";

const router = Router();

router.get("/cast", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const castInfo = await getMovieCastById(parseInt(id));

    res.status(200).send(castInfo);
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      if (e.message === ERROR_FETCHING_MOVIE_INFORMATION) {
        return res.status(400).send({ error: MOVIE_DOES_NOT_EXIST });
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
    const response = await axios.get("http://127.0.0.1:3524/all-movies");

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

export default router;
