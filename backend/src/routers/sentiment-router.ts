import axios, { AxiosError } from "axios";
import { Request, Response, Router } from "express";

import {
  ERROR_FETCHING_REVIEWS,
  ERROR_FETCHING_SENTIMENT,
  INTERNAL_SERVER_ERROR,
  NO_REVIEW_PROVIDED,
} from "../constants";
import authCheck from "../middleware/auth-check";
import MovieReview from "../models/movie-review";
import { IMovieUser } from "../models/movie-user";

const router = Router();

router.get("/get-reviews/:movie", authCheck, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const movie = req.params.movie;

    const reviews = await MovieReview.find({
      movie,
    })
      .limit(limit)
      .skip((page - 1) * limit);

    return res.json({ reviews });
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(400).send({ error: ERROR_FETCHING_REVIEWS });
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

router.post("/save-review/:movie", authCheck, async (req: Request, res: Response) => {
  const review = req.query.review;

  try {
    if (!review) {
      return res.status(400).send({ error: NO_REVIEW_PROVIDED });
    }

    const user = req.user as IMovieUser;
    const movie = req.params.movie as string;

    const response = await axios.get<{ sentiment: string }>(
      `${process.env.MODEL_BASE_URL}/sentiment?review=${review}`
    );

    if (response.status === 500) {
      return res.status(500).send({ error: ERROR_FETCHING_SENTIMENT });
    }

    const { sentiment } = response.data;

    const newReview = new MovieReview({
      review,
      sentiment,
      movie,
      movieUser: user?._id,
    });

    await newReview.save();

    return res.status(201).send(newReview);
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(400).send({ error: e.message });
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

export default router;
