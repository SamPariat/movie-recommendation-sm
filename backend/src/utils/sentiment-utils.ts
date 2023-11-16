import axios, { AxiosError } from "axios";
import mongoose from "mongoose";

import { ErrorMessages } from "../constants";
import { ErrorFetchingReviewSentiment, ModelServerError } from "../errors";
import MovieReview, { type IMovieReview } from "../models/movie-review";

const modelBaseUrl = process.env.MODEL_BASE_URL;

export const saveReview = async (
  review: string,
  userId: mongoose.Types.ObjectId,
  movie: string
): Promise<IMovieReview | null> => {
  try {
    const response = await axios.get<{ sentiment: "Positive" | "Negative" }>(
      `${modelBaseUrl}/sentiment?review=${review}`
    );

    if (response.status === 500) {
      throw new ModelServerError(ErrorMessages.ErrorFetchingSentiment);
    }

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
      throw new ErrorFetchingReviewSentiment(
        ErrorMessages.ErrorFetchingSentiment
      );
    }

    return null;
  }
};
