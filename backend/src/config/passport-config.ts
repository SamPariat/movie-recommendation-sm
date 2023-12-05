import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as LocalStrategy } from "passport-local";
import * as argon from "argon2";

import MovieUser from "../models/movie-user";
import { ErrorMessages } from "../constants";

type PassportUser = {
  _id?: string;
};

/**
 * Sets up the Google OAuth 2.0 and Local strategy
 */
export const passportConfig = () => {
  passport.serializeUser(async (user: PassportUser, done) => {
    console.log("Serializing user");
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user");
    try {
      const movieUser = await MovieUser.findById(id);

      if (movieUser) {
        return done(null, movieUser);
      }

      return done(ErrorMessages.UnableToAuthenticate, null);
    } catch (e) {
      return done(e, null);
    }
  });

  // Setup the google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
        callbackURL: "/auth/google/redirect",
      },
      async (_accessToken: string, _refreshToken: string, profile, done) => {
        try {
          const existingMovieUser = await MovieUser.findOne({
            googleId: profile.id,
          });

          if (!existingMovieUser) {
            const movieUser = new MovieUser({
              name: profile.displayName,
              email: profile.email,
              googleId: profile.id,
              thumbnailUrl: profile._json.picture,
            });

            await movieUser.save();

            return done(null, movieUser);
          } else {
            return done(null, existingMovieUser);
          }
        } catch (e) {
          return done(e, undefined);
        }
      }
    )
  );

  // Setup the local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (username: string, password: string, done) => {
        try {
          const existingMovieUser = await MovieUser.findOne({
            email: username,
          });

          if (existingMovieUser) {
            const match = await argon.verify(
              existingMovieUser.password as string,
              password
            );

            if (!match) {
              return done(ErrorMessages.Unauthorized, undefined);
            }

            return done(null, existingMovieUser);
          }

          return done(ErrorMessages.InvalidCredentials, undefined);
        } catch (e) {
          return done(e, undefined);
        }
      }
    )
  );
};
