import chalk from "chalk";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
  disableOfflineQueue: true,
});

redisClient.on("error", (error) => {
  console.log(chalk.bgRedBright.whiteBright("Redis Error", error));
});

if (!redisClient.isOpen) {
  redisClient.connect();
}

export { redisClient };
