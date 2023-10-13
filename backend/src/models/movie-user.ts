import { Document, Model, Schema, model } from "mongoose";

interface IMovieUser extends Document {
  name: string;
  googleId: string;
}

const movieUserSchema = new Schema<IMovieUser>({
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    required: true,
  },
});

const MovieUser: Model<IMovieUser> = model("movieuser", movieUserSchema);

export default MovieUser;
