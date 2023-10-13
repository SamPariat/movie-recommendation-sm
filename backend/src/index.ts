import chalk from "chalk";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import { passportConfig } from "./config/passport-config";
import googleAuthRouter from "./routers/google-auth";
import modelRouter from "./routers/model";

const app = express();

const PORT = process.env.PORT || 3523;

dotenv.config();
passportConfig();

app.set("views", "./src/views"); // To delete
app.set("view engine", "ejs"); // To delete

app.use(express.json()); // Parse incoming JSON as an object
app.use("/model", modelRouter); // Use the model's router
app.use("/auth/google", googleAuthRouter); // Use the google oauth 2.0 router

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.ATLAS_CONNECTION_URL!);
    console.log(chalk.yellowBright("Connected to the database"));
  } catch (e) {
    console.log(chalk.redBright("Can't connect to the database"));
  }
  console.log(
    chalk.green(`BTP Node.js backend running on port ${PORT}`)
  );
});
