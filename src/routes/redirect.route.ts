import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { redis } from "../config/redis.js";
import { UrlModel } from "../models/url.model.js";
import { errorResponseSchema, redirectParamsSchema } from "../schemas/url.schema.js";
import { decodeCode } from "../utils/hashids.js";

export const redirectRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/:code",
    {
      schema: {
        tags: ["URLs"],
        summary: "Redirecionar URL",
        description: "Decodifica código Base62, consulta cache Redis / MongoDB e redireciona com status 301",
        params: redirectParamsSchema,
        response: {
          404: errorResponseSchema
        }
      }
    },
    async (request, reply) => {
      const { code } = request.params;

      const numericId = decodeCode(code);
      if (numericId === null) {
        return reply.status(404).send({ message: "Invalid short URL code" });
      }

      const cachedUrl = await redis.get(`url:${code}`);
      if (cachedUrl) {
        return reply.redirect(cachedUrl, 301);
      }

      const urlRecord = await UrlModel.findOne({ numericId });
      if (!urlRecord) {
        return reply.status(404).send({ message: "URL not found" });
      }

      await redis.set(`url:${code}`, urlRecord.originalUrl);

      return reply.redirect(urlRecord.originalUrl, 301);
    }
  );
};
