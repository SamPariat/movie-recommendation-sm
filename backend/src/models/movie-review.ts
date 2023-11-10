import { Document, Model, Schema, model } from "mongoose";

export interface IMovieReview extends Document {
  review: string;
  sentiment: string;
  movie: string;
  movieUser: Schema.Types.ObjectId;
}

const movieReviewSchema = new Schema<IMovieReview>({
  review: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    required: true,
  },
  movie: {
    type: String,
    required: true,
  },
  movieUser: {
    type: Schema.Types.ObjectId,
    ref: "MovieUser",
  },
});

const MovieReview: Model<IMovieReview> = model(
  "moviereview",
  movieReviewSchema
);

export default MovieReview;
