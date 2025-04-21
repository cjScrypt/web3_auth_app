import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { REDIS_URL } from "../config";

export const redisClient: RedisClientType = createClient({
    url: REDIS_URL
});

redisClient.connect();