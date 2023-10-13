import passport from "passport";
import chalk from "chalk";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

import MovieUser from "../models/movie-user";

export const passportConfig = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        callbackURL: "/auth/google/redirect",
      },
      async (_accessToken, _refreshToken, profile, _done) => {
        // Create a user or use the existing one
        try {
          const existingMovieUser = await MovieUser.findOne({
            googleId: profile.id,
          });

          if (!existingMovieUser) {
            const movieUser = new MovieUser({
              name: profile.displayName,
              googleId: profile.id,
            });

            await movieUser.save();

            console.log(`Created user: ${movieUser}`);
          } else {
            console.log(`Saved user: ${existingMovieUser}`);
          }
        } catch (e) {
          console.log(e);
        }
      }
    )
  );
};
