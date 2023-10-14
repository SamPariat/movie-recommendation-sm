import { Document, Model, Schema, model } from "mongoose";

export interface IMovieUser extends Document {
  name: string;
  googleId?: string;
  thumbnailUrl?: string;
  password?: string;
}

const movieUserSchema = new Schema<IMovieUser>({
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
  password: {
    type: String,
  },
});

const MovieUser: Model<IMovieUser> = model("movieuser", movieUserSchema);

export default MovieUser;
