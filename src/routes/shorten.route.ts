import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { env } from "../config/env.js";
import { COUNTER_KEY, redis } from "../config/redis.js";
import { UrlModel } from "../models/url.model.js";
import { errorResponseSchema, shortenUrlBodySchema, shortenUrlResponseSchema } from "../schemas/url.schema.js";
import { encodeId } from "../utils/hashids.js";

export const shortenRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/shorten",
    {
      schema: {
        tags: ["URLs"],
        summary: "Encurtar URL",
        description: "Gera um código único em Base62 via Redis INCR e persiste no MongoDB e Redis",
        body: shortenUrlBodySchema,
        response: {
          201: shortenUrlResponseSchema,
          400: errorResponseSchema
        }
      }
    },
    async (request, reply) => {
      const { url } = request.body;

      const numericId = await redis.incr(COUNTER_KEY);
      const code = encodeId(numericId);

      await Promise.all([
        UrlModel.create({
          numericId,
          code,
          originalUrl: url
        }),
        redis.set(`url:${code}`, url)
      ]);

      const shortUrl = `${env.BASE_URL}/${code}`;

      return reply.status(201).send({
        code,
        shortUrl,
        originalUrl: url
      });
    }
  );
};
