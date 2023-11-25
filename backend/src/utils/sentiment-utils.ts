import axios, { AxiosError } from "axios";
import mongoose from "mongoose";

import { ErrorMessages } from "../constants";
import {
  ErrorFetchingReviewSentiment,
  ModelServerError,
  NoReviewProvidedError,
} from "../errors";
import MovieReview, { type IMovieReview } from "../models/movie-review";

export const saveReview = async (
  review: string,
  userId: mongoose.Types.ObjectId,
  movie: string
): Promise<IMovieReview> => {
  try {
    const response = await axios.get<{ sentiment: "Positive" | "Negative" }>(
      `${process.env.MODEL_BASE_URL}/sentiment?review=${review}`
    );

    const { sentiment } = response.data;

    const newReview = new MovieReview({
      review,
      sentiment,
      movie,
      movieUser: userId,
    });

    await newReview.save();

    return newReview;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 400) {
        throw new NoReviewProvidedError(ErrorMessages.NoReviewProvided);
      } else if (e.response?.status === 500) {
        throw new ErrorFetchingReviewSentiment(
          ErrorMessages.ErrorFetchingSentiment
        );
      } else {
        throw new ModelServerError(ErrorMessages.ErrorFetchingSentiment);
      }
    }

    throw e;
  }
};
