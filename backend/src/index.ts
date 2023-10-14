import chalk from "chalk";
import dotenv from "dotenv";
import express from "express";
import expressSession from "express-session";
import mongoose from "mongoose";
import passport from "passport";

import { passportConfig } from "./config/passport-config";
import googleAuthRouter from "./routers/google-auth";
import modelRouter from "./routers/model";
import profileRouter from "./routers/profile";

const app = express();

const PORT = process.env.PORT || 3523;

dotenv.config();
passportConfig();

app.use(express.json()); // Parse incoming JSON as an object
app.use(
  expressSession({
    secret:
      process.env.fwUN5LQBsa49BCUjHvPUe13g0 ?? "thisismysecretkeyfornodejs",
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    saveUninitialized: true,
  })
); // Use express session middleware
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Using session cookies
app.use("/model", modelRouter); // Use the model's router
app.use("/auth/google", googleAuthRouter); // Use the google oauth 2.0 router
app.use("/profile", profileRouter); // Use the profile's router

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.ATLAS_CONNECTION_URL!);
    console.log(chalk.yellow("[db-log] Connected to the database..."));
  } catch (e) {
    console.log(chalk.red("[db-log] Can't connect to the database..."));
    console.log(
      chalk.red(
        "[db-log] Check network connection and environment variables..."
      )
    );
  }
  console.log(
    chalk.blue(`[node-log] BTP Node.js backend running on port ${PORT}`)
  );
});
