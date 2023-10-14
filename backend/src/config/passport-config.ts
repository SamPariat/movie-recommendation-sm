import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

import MovieUser from "../models/movie-user";

type PassportUser = {
  _id?: string;
};

export const passportConfig = () => {
  passport.serializeUser(async (user: PassportUser, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const movieUser = await MovieUser.findById(id);

    if (movieUser) {
      done(null, movieUser);
    }
  });

  // Setup the google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        callbackURL: "/auth/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        // Create a user or use the existing one
        try {
          const existingMovieUser = await MovieUser.findOne({
            googleId: profile.id,
          });

          if (!existingMovieUser) {
            const movieUser = new MovieUser({
              name: profile.displayName,
              googleId: profile.id,
              thumbnailUrl: profile._json.image.url,
            });

            await movieUser.save();
            done(null, movieUser);

            console.log(`[passport-config] Created user: ${movieUser}`);
          } else {
            console.log(`[passport-config] Saved user: ${existingMovieUser}`);
            done(null, existingMovieUser);
          }
        } catch (e) {
          console.log(e);
        }
      }
    )
  );
};
