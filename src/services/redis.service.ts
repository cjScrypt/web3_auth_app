import { RedisClientType } from "@redis/client";
import { redisClient } from "./redis";

export class RedisService {
    client: RedisClientType;

    constructor() {
        this.client = redisClient;
    }

    async setValue(key: string, v: any, ttl?: number) {
        const value = JSON.stringify(v);
        if (ttl) {
            return this.client.set(key, value, { EX: ttl });
        }

        return this.client.set(key, value);
    }

    async getValue(key: string) {
        const data = await this.client.get(key);
        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }
}