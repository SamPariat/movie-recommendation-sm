import chalk from "chalk";
import express from "express";

import modelRouter from "./routers/model";

const app = express();

const PORT = process.env.PORT || 3523;

app.use(express.json()); // Parse incoming JSON as an object
app.use(modelRouter); // Use the model's router

app.listen(PORT, () => {
  console.log(chalk.greenBright(`BTP Node.js backend running on port ${PORT}`));
});
