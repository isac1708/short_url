import Redis from "ioredis";
import { env } from "./env.js";

export const COUNTER_KEY = "shorturl:counter";
export const INITIAL_COUNTER_VALUE = 238327; // O primeiro INCR retornará 238328

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

export async function initRedisCounter(): Promise<void> {
  await redis.set(COUNTER_KEY, INITIAL_COUNTER_VALUE, "NX");
}
