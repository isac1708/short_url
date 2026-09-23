import { z } from "zod";

export const shortenUrlBodySchema = z.object({
  url: z.string().url({ message: "Invalid URL format" })
});

export const shortenUrlResponseSchema = z.object({
  code: z.string(),
  shortUrl: z.string().url(),
  originalUrl: z.string().url()
});

export const redirectParamsSchema = z.object({
  code: z.string().min(1, { message: "Short code is required" })
});

export const errorResponseSchema = z.object({
  message: z.string()
});
