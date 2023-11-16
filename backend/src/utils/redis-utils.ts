import { redisClient } from "../config/redis-config";

export const storeRedisJson = async (
  redisPath: string,
  jsonPath: string,
  data: any
): Promise<any> => {
  await redisClient.json.SET(redisPath, jsonPath, JSON.stringify(data), {
    NX: true,
  });
};

export const retrieveRedisJson = async (
  redisPath: string,
  jsonPath: string
): Promise<any> => {
  const data = await redisClient.json.GET(redisPath, {
    path: jsonPath,
  });

  return JSON.parse(data as string);
};
