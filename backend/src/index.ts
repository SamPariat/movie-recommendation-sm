import chalk from "chalk";
import RedisStore from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import expressSession from "express-session";
import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";

import { passportConfig } from "./config/passport-config";
import { redisClient } from "./config/redis-config";
import { errorHandler } from "./middleware/errors";
import googleAuthRouter from "./routers/google-auth-router";
import localAuthRouter from "./routers/local-auth-router";
import movieRouter from "./routers/movie-router";
import profileRouter from "./routers/profile-router";
import recommendationRouter from "./routers/recommendation-router";
import sentimentRouter from "./routers/sentiment-router";

const app = express();

const PORT = process.env.PORT || 3523;

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "express-session:",
});

dotenv.config();
passportConfig();

app.use(morgan("dev"));
app.use(express.json()); // Parse incoming JSON as an object
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    preflightContinue: true,
  })
); // Setup cors for cross domain requests
app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET ?? "thisismysecretkeyfornodejs",
    resave: false,
    store: redisStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    saveUninitialized: true,
  })
); // Use express session middleware
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Using session cookies
app.use("/model", recommendationRouter); // Use the recommendation router
app.use("/auth/google", googleAuthRouter); // Use the google oauth 2.0 router
app.use("/auth/local", localAuthRouter); // Use the local auth router
app.use("/profile", profileRouter); // Use the profile's router
app.use("/sentiment", sentimentRouter); // Use the sentiment router
app.use("/movie", movieRouter); // Use the movie router
app.use(errorHandler); // Use the global error handler

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.ATLAS_CONNECTION_URL!);
    console.log(chalk.yellow("Connected to the database..."));
  } catch (e) {
    console.log(chalk.red("Can't connect to the database..."));
    console.log(
      chalk.red("Check network connection and environment variables...")
    );
  }
  console.log(chalk.blue(`BTP Node.js backend running on port ${PORT}`));
});
