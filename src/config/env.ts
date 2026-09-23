import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  BASE_URL: z.string().default("http://localhost:3000"),
  MONGO_URI: z.string().default("mongodb://localhost:27017/short_url"),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  HASHIDS_SALT: z.string().default("default_secret_salt")
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
